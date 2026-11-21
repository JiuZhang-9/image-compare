export type MockImageItem = {
  id: string;
  name: string;
  dimensions: string;
  role: "A" | "B" | null;
  variant: "a" | "b" | "c" | "d";
};

export const mockImages: MockImageItem[] = [
  {
    id: "img-1",
    name: "hero-banner@2x.png",
    dimensions: "3840 × 2160",
    role: "A",
    variant: "a",
  },
  {
    id: "img-2",
    name: "hero-banner-v2@2x.png",
    dimensions: "3840 × 2160",
    role: "B",
    variant: "b",
  },
  {
    id: "img-3",
    name: "product-card-front.webp",
    dimensions: "1600 × 1200",
    role: null,
    variant: "c",
  },
  {
    id: "img-4",
    name: "product-card-back.webp",
    dimensions: "1600 × 1200",
    role: null,
    variant: "d",
  },
  {
    id: "img-5",
    name: "icon-sheet.png",
    dimensions: "2048 × 2048",
    role: null,
    variant: "b",
  },
  {
    id: "img-6",
    name: "empty-state.svg",
    dimensions: "800 × 600",
    role: null,
    variant: "a",
  },
];
