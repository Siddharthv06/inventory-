export type ProductStatus = 'Draft' | 'Ready for Listing' | 'Listed' | 'Archived';
export type WeightUnit = 'g' | 'kg';
export type DimensionUnit = 'cm' | 'mm' | 'in';

export interface Category {
  id: string;
  user_id: string;
  name: string;
  description?: string | null;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export interface Product {
  id: string;
  user_id: string;
  created_by?: string | null;
  product_name: string;
  sku: string;
  category_id?: string | null;
  category?: Category | null;
  
  // Pricing
  purchase_cost: number;
  selling_price: number;
  currency: string;
  
  // Physical information
  weight_value: number;
  weight_unit: WeightUnit;
  length: number;
  width: number;
  height: number;
  dimension_unit: DimensionUnit;
  
  // Attributes
  material?: string | null;
  colour?: string | null;
  size?: string | null;
  
  // Listing information
  description?: string | null;
  keywords?: string | null;
  image_url?: string | null;
  drive_url?: string | null;
  
  // Tax information
  hsn_code?: string | null;
  gst_percentage: number;
  
  // Inventory
  stock_quantity: number;
  low_stock_threshold: number;
  
  // Management
  status: ProductStatus;
  internal_notes?: string | null;
  created_at: string;
  updated_at: string;
  archived_at?: string | null;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  product_id?: string | null;
  action: 'CREATE' | 'UPDATE' | 'ARCHIVE' | 'RESTORE' | 'DELETE' | 'STOCK_ADJUSTMENT' | 'IMPORT';
  description: string;
  metadata?: Record<string, any> | null;
  created_at: string;
  product_name?: string;
}

export interface StockMovement {
  id: string;
  product_id: string;
  user_id: string;
  previous_quantity: number;
  change_quantity: number;
  new_quantity: number;
  reason: string;
  created_at: string;
  product_name?: string;
  sku?: string;
}

export interface DashboardStats {
  totalProducts: number;
  activeListings: number;
  readyForListing: number;
  totalUnits: number;
  lowStockCount: number;
  outOfStockCount: number;
  totalPurchaseValue: number;
  totalSellingValue: number;
  draftCount: number;
  archivedCount: number;
}

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string | null;
  role: string;
  company_name?: string | null;
  created_at: string;
  updated_at: string;
}

