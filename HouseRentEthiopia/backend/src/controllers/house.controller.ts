import { Request, Response } from 'express';
import { prisma } from '../lib/prisma';
import { uploadImageBuffer } from '../services/cloudinary.service';

const LAT_MIN = -90, LAT_MAX = 90, LNG_MIN = -180, LNG_MAX = 180;

const getParamId = (value: string | string[] | undefined): string =>
  Array.isArray(value) ? (value[0] ?? '') : (value ?? '');

const validateCoords = (lat: any, lng: any) => {
  const la = Number(lat);
  const ln = Number(lng);
  if (isNaN(la) || isNaN(ln)) return { error: 'Latitude and longitude must be numbers' };
  if (la < LAT_MIN || la > LAT_MAX || ln < LNG_MIN || ln > LNG_MAX) {
    return { error: `Coordinates out of range (lat ${LAT_MIN}..${LAT_MAX}, lng ${LNG_MIN}..${LNG_MAX})` };
  }
  return { lat: la, lng: ln };
};

/** Find a house whose lat/long tuple matches exactly (uniqueness check). */
const findDuplicate = (lat: number, lng: number, excludeId?: string) => {
  return prisma.house.findFirst({
    where: {
      latitude: lat,
      longitude: lng,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  });
};

export const createHouse = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const {
      title, description, price, address, city, latitude, longitude,
      bedrooms, bathrooms, houseType, status, imageUrls,
    } = req.body;

    if (!title || !description || !price || !address || !city) {
      return res.status(400).json({ success: false, message: 'Missing required house fields' });
    }

    const coords = validateCoords(latitude, longitude);
    if (coords.error) return res.status(400).json({ success: false, message: coords.error });

    const duplicate = await findDuplicate(coords.lat!, coords.lng!);
    if (duplicate) {
      return res.status(409).json({
        success: false,
        message: 'A house is already listed at these exact coordinates (unique location). Drop the pin again or adjust it slightly.',
      });
    }

    const house = await prisma.house.create({
      data: {
        title,
        description,
        price: Number(price),
        address,
        city,
        latitude: coords.lat!,
        longitude: coords.lng!,
        bedrooms: Number(bedrooms || 1),
        bathrooms: Number(bathrooms || 1),
        houseType: houseType || 'APARTMENT',
        status: status || 'AVAILABLE',
        ownerId: user.id,
        images: Array.isArray(imageUrls) && imageUrls.length
          ? { create: imageUrls.map((url: string) => ({ url })) }
          : undefined,
      },
      include: { images: true, owner: { select: { id: true, name: true, email: true, phoneNumber: true } } },
    });

    res.status(201).json({ success: true, house });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'A house is already listed at these exact coordinates.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHouses = async (req: Request, res: Response) => {
  try {
    const { city, minPrice, maxPrice, houseType, lat, lng, radius } = req.query;
    const where: any = {};
    if (city) where.city = city;
    if (houseType) where.houseType = houseType;
    if (minPrice || maxPrice) where.price = { ...(minPrice ? { gte: Number(minPrice) } : {}), ...(maxPrice ? { lte: Number(maxPrice) } : {}) };

    // Simple bounding-box filter when a center + radius (km) are given.
    if (lat && lng && radius) {
      const la = Number(lat), ln = Number(lng), km = Number(radius);
      const degLat = km / 110.574;
      const degLng = km / (111.320 * Math.cos((la * Math.PI) / 180));
      where.latitude = { gte: la - degLat, lte: la + degLat };
      where.longitude = { gte: ln - degLng, lte: ln + degLng };
    }

    const houses = await prisma.house.findMany({
      where,
      include: { images: true, owner: { select: { id: true, name: true, phoneNumber: true } } },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, houses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getHouseById = async (req: Request, res: Response) => {
  try {
    const house = await prisma.house.findUnique({
      where: { id: getParamId(req.params.id) },
      include: { images: true, owner: { select: { id: true, name: true, phoneNumber: true, email: true } } },
    });
    if (!house) return res.status(404).json({ success: false, message: 'House not found' });
    res.status(200).json({ success: true, house });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHouse = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const existing = await prisma.house.findUnique({ where: { id: getParamId(req.params.id) } });
    if (!existing) return res.status(404).json({ success: false, message: 'House not found' });
    if (existing.ownerId !== user.id && user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'You can only edit your own house listings' });
    }

    const { latitude, longitude, ...rest } = req.body;
    let data: any = { ...rest };
    if (latitude !== undefined && longitude !== undefined) {
      const coords = validateCoords(latitude, longitude);
      if (coords.error) return res.status(400).json({ success: false, message: coords.error });
      const duplicate = await findDuplicate(coords.lat!, coords.lng!, existing.id);
      if (duplicate) return res.status(409).json({ success: false, message: 'Another house is already listed at these exact coordinates.' });
      data.latitude = coords.lat;
      data.longitude = coords.lng;
    }

    const house = await prisma.house.update({
      where: { id: existing.id },
      data,
      include: { images: true },
    });
    res.status(200).json({ success: true, house });
  } catch (error: any) {
    if (error?.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'A house is already listed at these exact coordinates.' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteHouse = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const existing = await prisma.house.findUnique({ where: { id: getParamId(req.params.id) } });
    if (!existing) return res.status(404).json({ success: false, message: 'House not found' });
    if (existing.ownerId !== user.id && user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'You can only delete your own house listings' });
    }
    await prisma.house.delete({ where: { id: existing.id } });
    res.status(200).json({ success: true, message: 'House deleted' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMyHouses = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const houses = await prisma.house.findMany({
      where: { ownerId: user.id },
      include: { images: true },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, houses });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/** Owner uploads a house photo directly via Cloudinary upload preset. */
export const uploadHousePhoto = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const url = await uploadImageBuffer(req.file.buffer);
    res.status(200).json({ success: true, url });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};