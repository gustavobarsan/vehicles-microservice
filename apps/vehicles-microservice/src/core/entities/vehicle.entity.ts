export class Vehicle {
  id?: string;
  plate: string;
  chassis: string;
  renavam: string;
  model: string;
  brand: string;
  year: number;
  color: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: Partial<Vehicle>) {
    Object.assign(this, props);
    if (!this.createdAt) this.createdAt = new Date();
    this.updatedAt = new Date();
  }
}
