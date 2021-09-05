type TModel = {
  name: string;
  description?: string;
  contentType: string;
  schema: TSchema;
};

type TSchema =
  | {
      type: 'object';
      properties: {
        [key: string]: TSchema;
      };
      required?: string[];
      additionalProperties?: boolean;
    }
  | {
      type: 'array';
      items: TSchema;
    }
  | {
      type: 'string';
      enum?: string[];
    }
  | {
      type: 'null' | 'number' | 'boolean';
    }
  | {
      type: string[];
    }
  | { $ref: string };

const PRODUCT_MODELS: TModel[] = [
  {
    name: 'ProductsWrapper',
    description: '',
    contentType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        products: {
          $ref: '{{model: Products}}',
        },
      },
    },
  },
  {
    name: 'Products',
    description: '',
    contentType: 'application/json',
    schema: {
      type: 'array',
      items: {
        $ref: '{{model: Product}}',
      },
    },
  },
  {
    name: 'Product',
    description: '',
    contentType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        __typename: {
          $ref: '{{model: ProductTypename}}',
        },
        id: {
          type: 'string',
        },
        productCode: {
          type: 'string',
        },
        name: {
          type: 'string',
        },
        slug: {
          type: 'string',
        },
        primaryImage: {
          type: 'string',
        },
        baseImgUrl: {
          type: 'string',
        },
        overrideUrl: {
          type: 'null',
        },
        variant: {
          $ref: '{{model: Variant}}',
        },
      },
      required: [
        '__typename',
        'id',
        'productCode',
        'name',
        'slug',
        'primaryImage',
        'baseImgUrl',
        'overrideUrl',
        'variant',
      ],
      additionalProperties: false,
    },
  },
  {
    name: 'ProductTypename',
    description: '',
    contentType: 'application/json',
    schema: {
      type: 'string',
      enum: ['SingleVariantProduct'],
    },
  },
  {
    name: 'Variant',
    description: '',
    contentType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
        },
        sku: {
          type: 'string',
        },
        salePercentage: {
          type: 'number',
        },
        attributes: {
          $ref: '{{model: Attributes}}',
        },
        price: {
          $ref: '{{model: Price}}',
        },
        listPrice: {
          $ref: '{{model: ListPrice}}',
        },
        __typename: {
          $ref: '{{model: VariantTypename}}',
        },
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
    },
  },
  {
    name: 'Attributes',
    description: '',
    contentType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        rating: {
          type: ['number', 'null'],
        },
        maxOrderQuantity: {
          type: 'number',
        },
        availabilityStatus: {
          $ref: '{{model: AvailabilityStatus}}',
        },
        availabilityText: {
          $ref: '{{model: AvailabilityText}}',
        },
        vipAvailabilityStatus: {
          type: 'null',
        },
        vipAvailabilityText: {
          type: 'null',
        },
        canAddToBag: {
          type: 'boolean',
        },
        canAddToWishlist: {
          type: 'boolean',
        },
        vipCanAddToBag: {
          type: 'null',
        },
        onSale: {
          type: 'boolean',
        },
        isNew: {
          type: ['boolean', 'null'],
        },
        featuredFlags: {
          type: 'array',
          items: {
            $ref: '{{model: FeaturedFlag}}',
          },
        },
        __typename: {
          $ref: '{{model: AttributesTypename}}',
        },
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
    },
  },
  {
    name: 'AvailabilityStatus',
    description: '',
    contentType: 'application/json',
    schema: {
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
    },
  },
  {
    name: 'AvailabilityText',
    description: '',
    contentType: 'application/json',
    schema: {
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
    },
  },
  {
    name: 'FeaturedFlag',
    description: '',
    contentType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        key: {
          $ref: '{{model: Key}}',
        },
        label: {
          $ref: '{{model: Label}}',
        },
        __typename: {
          $ref: '{{model: FeaturedFlagTypename}}',
        },
      },
      required: ['key', 'label', '__typename'],
      additionalProperties: false,
    },
  },
  {
    name: 'Key',
    description: '',
    contentType: 'application/json',
    schema: {
      type: 'string',
      enum: ['hardToFind', 'new'],
    },
  },
  {
    name: 'Label',
    description: '',
    contentType: 'application/json',
    schema: {
      type: 'string',
      enum: ['Hard to find', 'New'],
    },
  },
  {
    name: 'FeaturedFlagTypename',
    description: '',
    contentType: 'application/json',
    schema: {
      type: 'string',
      enum: ['FeaturedFlags'],
    },
  },
  {
    name: 'AttributesTypename',
    description: '',
    contentType: 'application/json',
    schema: {
      type: 'string',
      enum: ['ProductAttributes'],
    },
  },
  {
    name: 'Price',
    description: '',
    contentType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        formattedAmount: {
          type: 'string',
        },
        centAmount: {
          type: 'number',
        },
        currencyCode: {
          $ref: '{{model: CurrencyCode}}',
        },
        formattedValue: {
          type: 'number',
        },
        __typename: {
          $ref: '{{model: ListPriceTypename}}',
        },
      },
      required: [
        'formattedAmount',
        'centAmount',
        'currencyCode',
        'formattedValue',
        '__typename',
      ],
      additionalProperties: false,
    },
  },
  {
    name: 'CurrencyCode',
    description: '',
    contentType: 'application/json',
    schema: {
      type: 'string',
      enum: ['USD'],
    },
  },
  {
    name: 'ListPriceTypename',
    description: '',
    contentType: 'application/json',
    schema: {
      type: 'string',
      enum: ['Price'],
    },
  },
  {
    name: 'ListPrice',
    description: '',
    contentType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        formattedAmount: {
          type: 'string',
        },
        centAmount: {
          type: 'number',
        },
        __typename: {
          $ref: '{{model: ListPriceTypename}}',
        },
      },
      required: ['formattedAmount', 'centAmount', '__typename'],
      additionalProperties: false,
    },
  },
  {
    name: 'VariantTypename',
    description: '',
    contentType: 'application/json',
    schema: {
      type: 'string',
      enum: ['ProductVariant'],
    },
  },
];

const REQUEST_MODELS: TModel[] = [
  {
    name: 'StoreProduct',
    contentType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        product: {
          type: 'object',
          properties: {
            __typename: {
              $ref: '{{model: ProductTypename}}',
            },
            productCode: {
              type: 'string',
            },
            name: {
              type: 'string',
            },
            slug: {
              type: 'string',
            },
            primaryImage: {
              type: 'string',
            },
            baseImgUrl: {
              type: 'string',
            },
            overrideUrl: {
              type: 'null',
            },
            variant: {
              $ref: '{{model: Variant}}',
            },
          },
          required: [
            '__typename',
            'productCode',
            'name',
            'slug',
            'primaryImage',
            'baseImgUrl',
            'overrideUrl',
            'variant',
          ],
          additionalProperties: false,
        },
      },
      required: ['product'],
      additionalProperties: false,
    },
  },
];

const RESPONSE_MODELS: TModel[] = [
  {
    name: 'ResponseWithMessage',
    contentType: 'application/json',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
        },
      },
    },
  },
];

export const DOCUMENTATION_MODELS: TModel[] = [
  ...PRODUCT_MODELS,
  ...REQUEST_MODELS,
  ...RESPONSE_MODELS,
];
