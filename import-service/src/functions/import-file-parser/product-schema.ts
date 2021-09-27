export default {
  $schema: 'http://json-schema.org/draft-07/schema#',
  $ref: '#/definitions/Product',
  definitions: {
    Product: {
      type: 'object',
      properties: {
        __typename: {
          $ref: '#/definitions/ProductTypename',
        },
        // id: {
        //   type: 'string',
        // },
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
          $ref: '#/definitions/Variant',
        },
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
    },
    ProductTypename: {
      type: 'string',
      const: 'SingleVariantProduct',
    },
    Variant: {
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
          $ref: '#/definitions/Attributes',
        },
        price: {
          $ref: '#/definitions/Price',
        },
        listPrice: {
          $ref: '#/definitions/ListPrice',
        },
        __typename: {
          $ref: '#/definitions/VariantTypename',
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
    Attributes: {
      type: 'object',
      properties: {
        rating: {
          type: ['number', 'null'],
        },
        maxOrderQuantity: {
          type: 'number',
        },
        availabilityStatus: {
          $ref: '#/definitions/AvailabilityStatus',
        },
        availabilityText: {
          $ref: '#/definitions/AvailabilityText',
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
            $ref: '#/definitions/FeaturedFlag',
          },
        },
        __typename: {
          $ref: '#/definitions/AttributesTypename',
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
    AvailabilityStatus: {
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
    AvailabilityText: {
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
    FeaturedFlag: {
      type: 'object',
      properties: {
        key: {
          $ref: '#/definitions/Key',
        },
        label: {
          $ref: '#/definitions/Label',
        },
        __typename: {
          $ref: '#/definitions/FeaturedFlagTypename',
        },
      },
      required: ['key', 'label', '__typename'],
      additionalProperties: false,
    },
    Key: {
      type: 'string',
      enum: ['hardToFind', 'new'],
    },
    Label: {
      type: 'string',
      enum: ['Hard to find', 'New'],
    },
    FeaturedFlagTypename: {
      type: 'string',
      const: 'FeaturedFlags',
    },
    AttributesTypename: {
      type: 'string',
      const: 'ProductAttributes',
    },
    Price: {
      type: 'object',
      properties: {
        formattedAmount: {
          type: 'string',
        },
        centAmount: {
          type: 'number',
        },
        currencyCode: {
          $ref: '#/definitions/CurrencyCode',
        },
        formattedValue: {
          type: 'number',
        },
        __typename: {
          $ref: '#/definitions/ListPriceTypename',
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
    CurrencyCode: {
      type: 'string',
      const: 'USD',
    },
    ListPriceTypename: {
      type: 'string',
      const: 'Price',
    },
    ListPrice: {
      type: 'object',
      properties: {
        formattedAmount: {
          type: 'string',
        },
        centAmount: {
          type: 'number',
        },
        __typename: {
          $ref: '#/definitions/ListPriceTypename',
        },
      },
      required: ['formattedAmount', 'centAmount', '__typename'],
      additionalProperties: false,
    },
    VariantTypename: {
      type: 'string',
      const: 'ProductVariant',
    },
  },
};
