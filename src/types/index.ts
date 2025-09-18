export type IngredientCategory = 'fruit' | 'vegetable' | 'dairy' | 'fish' | 'meat' | 'liquid' | 'other';
export type IngredientLocation = 'fridge' | 'freezer' | 'pantry' | 'other';
export type ConfectionType = 'fresh' | 'canned' | 'frozen' | 'cured' | 'other';


export type RipenessStatus = 'green' | 'ripe' | 'advanced' | 'too_ripe';


export interface Ingredient {
  id: string; 
  name: string;
  category?: IngredientCategory;
  location?: IngredientLocation;
  confectionType?: ConfectionType;
  expirationDate?: Date;
  dateAdded: Date;
  ripeness?: {
    status: RipenessStatus;
    lastChecked: Date; 
  };
  isOpen: boolean;
  brand?: string;
}