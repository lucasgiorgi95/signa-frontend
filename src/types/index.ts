export interface Brand {
  id: string;
  name: string;
  description: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandFormData {
  name: string;
  description: string;
  owner: string;
}
