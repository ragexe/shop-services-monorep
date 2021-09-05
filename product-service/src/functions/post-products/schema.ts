const VariantTypenameSchema = {
  type: 'string',
  const: 'ProductVariant',
} as const;

const ListPriceTypenameSchema = { type: 'string', const: 'Price' } as const;

const ListPriceSchema = {
  type: 'object',
  properties: {
    formattedAmount: { type: 'string' },
    centAmount: { type: 'number' },
    __typename: ListPriceTypenameSchema,
  },
  required: ['formattedAmount', 'centAmount', '__typename'],
  additionalProperties: false,
} as const;

const CurrencyCodeSchema = { type: 'string', const: 'USD' } as const;

const PriceSchema = {
  type: 'object',
  properties: {
    formattedAmount: { type: 'string' },
    centAmount: { type: 'number' },
    currencyCode: CurrencyCodeSchema,
    formattedValue: { type: 'number' },
    __typename: ListPriceTypenameSchema,
  },
  required: [
    'formattedAmount',
    'centAmount',
    'currencyCode',
    'formattedValue',
    '__typename',
  ],
  additionalProperties: false,
} as const;

const AttributesTypenameSchema = {
  type: 'string',
  const: 'ProductAttributes',
} as const;

const FeaturedFlagTypenameSchema = {
  type: 'string',
  const: 'FeaturedFlags',
} as const;

const LabelSchema = { type: 'string', enum: ['Hard to find', 'New'] } as const;

const KeySchema = { type: 'string', enum: ['hardToFind', 'new'] } as const;

const FeaturedFlagSchema = {
  type: 'object',
  properties: {
    key: KeySchema,
    label: LabelSchema,
    __typename: FeaturedFlagTypenameSchema,
  },
  required: ['key', 'label', '__typename'],
  additionalProperties: false,
} as const;

const AvailabilityTextSchema = {
  type: 'string',
  enum: [
    'Available now',
    'Backorders accepted, will ship by September 2, 2021',
    'Backorders accepted, will ship in 60 days',
    'Coming Soon',
    'Coming Soon on October 1, 2021',
    'Coming Soon on September 1, 2021',
    'Sold out',
    'Temporarily out of stock',
  ],
} as const;

const AvailabilityStatusSchema = {
  type: 'string',
  enum: [
    'B_COMING_SOON_AT_DATE',
    'D_COMING_SOON',
    'E_AVAILABLE',
    'F_BACKORDER_FOR_DATE',
    'G_BACKORDER',
    'H_OUT_OF_STOCK',
    'K_SOLD_OUT',
  ],
} as const;

const AttributesSchema = {
  type: 'object',
  properties: {
    rating: { type: ['number', 'null'] },
    maxOrderQuantity: { type: 'number' },
    availabilityStatus: AvailabilityStatusSchema,
    availabilityText: AvailabilityTextSchema,
    vipAvailabilityStatus: { type: 'null' },
    vipAvailabilityText: { type: 'null' },
    canAddToBag: { type: 'boolean' },
    canAddToWishlist: { type: 'boolean' },
    vipCanAddToBag: { type: 'null' },
    onSale: { type: 'boolean' },
    isNew: { type: ['boolean', 'null'] },
    featuredFlags: { type: 'array', items: FeaturedFlagSchema },
    __typename: AttributesTypenameSchema,
  },
  required: [
    'rating',
    'maxOrderQuantity',
    'availabilityStatus',
    'availabilityText',
    'vipAvailabilityStatus',
    'vipAvailabilityText',
    'canAddToBag',
    'canAddToWishlist',
    'vipCanAddToBag',
    'onSale',
    'isNew',
    'featuredFlags',
    '__typename',
  ],
  additionalProperties: false,
} as const;

const VariantSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    sku: { type: 'string' },
    salePercentage: { type: 'number' },
    attributes: AttributesSchema,
    price: PriceSchema,
    listPrice: ListPriceSchema,
    __typename: VariantTypenameSchema,
  },
  required: [
    'id',
    'sku',
    'salePercentage',
    'attributes',
    'price',
    'listPrice',
    '__typename',
  ],
  additionalProperties: false,
} as const;

const ProductTypenameSchema = {
  type: 'string',
  const: 'SingleVariantProduct',
} as const;

const ProductSchema = {
  type: 'object',
  properties: {
    __typename: ProductTypenameSchema,
    // id: { type: 'string' }, // ID to be generated on database side
    productCode: { type: 'string' },
    name: { type: 'string' },
    slug: { type: 'string' },
    primaryImage: { type: 'string' },
    baseImgUrl: { type: 'string' },
    overrideUrl: { type: 'null' },
    variant: VariantSchema,
  },
  required: [
    '__typename',
    // 'id',
    'productCode',
    'name',
    'slug',
    'primaryImage',
    'baseImgUrl',
    'overrideUrl',
    'variant',
  ],
  additionalProperties: false,
} as const;

export const postRequestProductSchema = {
  type: 'object',
  properties: {
    product: ProductSchema,
  },
  required: ['product'],
} as const;
