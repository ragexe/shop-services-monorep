import { QueryConfig } from "pg";

export type TProductDTO = Pick<Product, '__typename' | 'id' | 'slug'> & {
  primary_image: Product['primaryImage'];
  base_img_url: Product['baseImgUrl'];
  override_url: Product['overrideUrl'];
  product_code: Product['productCode'];
  title: string;
  description: string;
  price: number;
  count: number;
  variant: Variant | string;
};

export const getProductDTO = (product: Product): TProductDTO => {
  const { __typename, slug } = product;
  
  return {
    __typename,
    slug,
    primary_image: product.primaryImage,
    base_img_url: product.baseImgUrl,
    override_url: product.overrideUrl,
    product_code: product.productCode,
    title: product.name,
    description: product.name,
    price: product.variant.price.formattedValue,
    count: product.variant.attributes.maxOrderQuantity,
    variant: JSON.stringify(product.variant),
  };
};

export const getProductFromDTO = (productDTO: TProductDTO): Product => {
  const {
    __typename,
    id,
    product_code: productCode,
    title,
    slug,
    primary_image: primaryImage,
    base_img_url: baseImgUrl,
    override_url: overrideUrl,
    price,
    count,
    variant,
  } = productDTO;

  const decoratedVariant: Variant =
    typeof variant == 'string' ? JSON.parse(variant) : variant;
  decoratedVariant.price.formattedValue = price;
  decoratedVariant.attributes.maxOrderQuantity = count;

  return {
    __typename,
    id,
    productCode,
    name: title,
    slug,
    primaryImage,
    baseImgUrl,
    overrideUrl,
    variant: decoratedVariant,
  };
};

export interface DataProvider<T> {
  retrieve: (query?: string | QueryConfig) => Promise<T | null | undefined>;
}

export interface DataConsumer<T> {
  store: (data: T) => Promise<void>;
}

export enum ErrorMessages {
  ProductDataIsInvalid = 'Product data is invalid',
  SomethingBadHappened = 'Something bad happened!',
  InternalDBError = 'Internal database error!',
  BadIdValue = 'Empty {id} value!',
  BadFormat = 'Bad format!',
  NotFound = 'Not found!',
}

// Generated by https://quicktype.io
//

export interface Product {
  __typename: ProductTypename;
  id?: string;
  productCode: string;
  name: string;
  slug: string;
  primaryImage: string;
  baseImgUrl: string;
  overrideUrl: null;
  variant: Variant;
}

export enum ProductTypename {
  SingleVariantProduct = 'SingleVariantProduct',
}

export interface Variant {
  id: string;
  sku: string;
  salePercentage: number;
  attributes: Attributes;
  price: Price;
  listPrice: ListPrice;
  __typename: VariantTypename;
}

export enum VariantTypename {
  ProductVariant = 'ProductVariant',
}

export interface Attributes {
  rating: number | null;
  maxOrderQuantity: number;
  availabilityStatus: AvailabilityStatus;
  availabilityText: AvailabilityText;
  vipAvailabilityStatus: null;
  vipAvailabilityText: null;
  canAddToBag: boolean;
  canAddToWishlist: boolean;
  vipCanAddToBag: null;
  onSale: boolean;
  isNew: boolean | null;
  featuredFlags: FeaturedFlag[];
  __typename: AttributesTypename;
}

export enum AttributesTypename {
  ProductAttributes = 'ProductAttributes',
}

export enum AvailabilityStatus {
  BComingSoonAtDate = 'B_COMING_SOON_AT_DATE',
  DComingSoon = 'D_COMING_SOON',
  EAvailable = 'E_AVAILABLE',
  FBackorderForDate = 'F_BACKORDER_FOR_DATE',
  GBackorder = 'G_BACKORDER',
  HOutOfStock = 'H_OUT_OF_STOCK',
  KSoldOut = 'K_SOLD_OUT',
}

export enum AvailabilityText {
  AvailableNow = 'Available now',
  BackordersAcceptedWillShipBySeptember22021 = 'Backorders accepted, will ship by September 2, 2021',
  BackordersAcceptedWillShipIn60Days = 'Backorders accepted, will ship in 60 days',
  ComingSoon = 'Coming Soon',
  ComingSoonOnOctober12021 = 'Coming Soon on October 1, 2021',
  ComingSoonOnSeptember12021 = 'Coming Soon on September 1, 2021',
  SoldOut = 'Sold out',
  TemporarilyOutOfStock = 'Temporarily out of stock',
}

export interface FeaturedFlag {
  key: Key;
  label: Label;
  __typename: FeaturedFlagTypename;
}

export enum FeaturedFlagTypename {
  FeaturedFlags = 'FeaturedFlags',
}

export enum Key {
  HardToFind = 'hardToFind',
  New = 'new',
}

export enum Label {
  HardToFind = 'Hard to find',
  New = 'New',
}

export interface ListPrice {
  formattedAmount: string;
  centAmount: number;
  __typename: ListPriceTypename;
}

export enum ListPriceTypename {
  Price = 'Price',
}

export interface Price {
  formattedAmount: string;
  centAmount: number;
  currencyCode: CurrencyCode;
  formattedValue: number;
  __typename: ListPriceTypename;
}

export enum CurrencyCode {
  Usd = 'USD',
}
