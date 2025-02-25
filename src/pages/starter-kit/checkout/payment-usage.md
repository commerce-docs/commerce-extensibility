---
title: Payment API JavaScript usage
description: Learn how to use the Payment API in the Adobe Commerce checkout starter kit.
keywords:
  - App Builder
  - Extensibility
---

# Payment API JavaScript usage

To call the Commerce REST endpoints, initialize the Adobe Commerce Client:

```javascript
const { getAdobeCommerceClient } = require('../lib/adobe-commerce');
const commerceClient = await getAdobeCommerceClient(process.env);
```

## Create a new payment method

`createOopePaymentMethod` creates a new out-of-process payment method with the necessary details such as `code`, `title`, and `configuration`.

**Payload parameters:**

| Parameter                 | Type     | Required | Description |
| ------------------------- | ------- | ----- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `code`                    | String  | Yes | Unique identifier for the payment method.|
| `title`                   | String  | No | Display name of the payment method.|
| `description`             | String  | No | Description of the payment method.|
| `active`                  | Boolean | Yes | Status indicating if the method is active.|
| `backend_integration_url` | String  | No | URL for backend integration, which is an App Builder URL.|
| `stores`                  | Array   | No | List of store codes that payment method is available for.|
| `order_status`            | String  | No | Initial [order status](https://experienceleague.adobe.com/en/docs/commerce-admin/stores-sales/order-management/orders/order-status) when using this method. Default is `pending`. |
| `countries`               | Array   | No | List of countries where the method is available.|
| `currencies`              | Array   | No | Currencies supported by the payment method.|
| `custom_config`           | Array   | No | Custom configuration settings for payment methods.|

<CodeBlock slots="heading, code" repeat="2" languages="javascript, javascript" />

#### Example usage

```javascript
try {
  const createResponse = await commerceClient.createOopePaymentMethod({
    code: 'method-1',
    title: 'Method 1',
    description: 'Description for Method 1',
    active: true,
    backend_integration_url: 'https://example.com',
    stores: ['store-1', 'store-2'],
    order_status: 'processing',
    countries: ['US', 'ES'],
    currencies: ['USD', 'EUR'],
    custom_config: [{ key: 'key1', value: 'value1' }],
  });

  if (!createResponse.success) {
    return errorResponse(createResponse.statusCode, 'Failed to create payment method');
  }

  console.log('Created payment method:', createResponse.message);
} catch (error) {
  return errorResponse(HTTP_INTERNAL_ERROR, 'Error occurred while creating payment method');
}
```

#### Example response

```json
{
  "success": true,
  "message": {
    "id": 3,
    "code": "method-1",
    "title": "Method 1",
    "description": "Description for Method 1",
    "active": true,
    "backend_integration_url": "http://example.com",
    "stores": ["store-1", "store-2"],
    "order_status": "processing",
    "countries": ["ES", "US"],
    "currencies": ["EUR", "USD"],
    "custom_config": [
      {
        "key1": "value1"
      }
    ]
  }
}
```

## List all payment methods

`getOopePaymentMethods` retrieves a list of all out-of-process payment methods in the Adobe Commerce instance.

<CodeBlock slots="heading, code" repeat="2" languages="javascript, javascript" />

#### Example usage

```javascript
try {
  const listResponse = await commerceClient.getOopePaymentMethods();
  if (!listResponse.success) {
    return errorResponse(listResponse.statusCode, 'Failed to list payment methods');
  }
  console.log('List of payment methods:', listResponse.message);
} catch (error) {
  return errorResponse(HTTP_INTERNAL_ERROR, 'Error occurred while listing payment methods');
}
```

#### Example response

```json
{
  "success": true,
  "message": [
    {
      "id": 1,
      "code": "method-1",
      "title": "Method one",
      "active": true,
      "backend_integration_url": "http://oope-payment-method.pay/event",
      "stores": [],
      "order_status": "complete",
      "countries": [],
      "currencies": [],
      "custom_config": []
    }
  ]
}
```

## Get an OOPE payment method by code

`getOopePaymentMethod` retrieves one out-of-process payment method by code from the Adobe Commerce instance.

**Payload parameters:**

| Parameter | Type   | Description                               |
| --------- | ------ | ----------------------------------------- |
| `code`    | String | Unique identifier for the payment method. |

<CodeBlock slots="heading, code" repeat="2" languages="javascript, javascript" />

#### Example usage

```javascript
try {
  const getResponse = await commerceClient.getOopePaymentMethod('method-1');
  if (!getResponse.success) {
    return errorResponse(getResponse.statusCode, 'Failed to retrieve payment method');
  }
  console.log('Retrieved payment method details:', getResponse.message);
} catch (error) {
  return errorResponse(HTTP_INTERNAL_ERROR, 'Error occurred while retrieving payment method');
}
```

#### Example response

```json
{
  "success": true,
  "message": {
    "id": 2,
    "code": "method-1",
    "title": "Method one",
    "active": true,
    "backend_integration_url": "http://<oope-payment-method.pay>/event",
    "stores": ["default"],
    "order_status": "complete",
    "countries": ["ES", "US"],
    "currencies": ["EUR", "USD"],
    "custom_config": [
      {
        "key": "can_refund",
        "value": "true"
      }
    ]
  }
}
```

## Retrieve an order by masked cart ID

`getOrderByMaskedCartId` retrieves order details from the Adobe Commerce instance using `maskedCartID`. This is typically used when the app builder application receives a webhook or event from the payment gateway.

This method uses the Adobe Commerce API [order search criteria](https://developer.adobe.com/commerce/webapi/rest/use-rest/performing-searches/#other-search-criteria).

**Payload parameters:**

| Parameter      | Type   | Description                                           |
| -------------- | ------ | ----------------------------------------------------- |
| `maskedCartId` | String | The cart ID from the payment method webhook or event. |

**Example usage:**

```javascript
try {
  const orderResponse = await commerceClient.getOrderByMaskedCartId(maskedCartId);
  if (!orderResponse.success) {
    const errMsg =
      orderResponse.statusCode === HTTP_NOT_FOUND
        ? 'Order not found for the given maskedCartId.'
        : 'Unexpected error getting order by maskedCartId';
    return errorResponse(orderResponse.statusCode, errMsg);
  }
  console.log('Order details:', orderResponse.message);
} catch (error) {
  return errorResponse(HTTP_INTERNAL_ERROR, 'Failed to fetch order due to an unexpected error');
}
```

## Create a new OOPE shipping carrier

`createOopeShippingCarrier` creates a new out-of-process shipping carrier with the necessary details such as `code`, `title`, and `configuration`.

**Payload parameters:**

| Parameter                   | Type    | Required | Description                                                              |
|-----------------------------|---------|----------|--------------------------------------------------------------------------|
| `code`                      | String  | Yes      | Unique identifier for the shipping carrier.                              |
| `title`                     | String  | Yes      | Display name of the shipping carrier.                                    |
| `stores`                    | Array   | No       | List of store codes where the shipping carrier is available.             |
| `countries`                 | Array   | No       | List of countries where the shipping carrier is available.               |
| `active`                    | Boolean | No       | Status indicating if the shipping carrier is active.                     |
| `sort_order`                | Integer | No       | The sort order of shipping carriers.                                     |
| `tracking_available`        | Boolean | No       | Status indicating if the shipping carrier has available tracking.        |
| `shipping_labels_available` | Boolean | No       | Status indicating if the shipping carrier has available shipping labels. |

<CodeBlock slots="heading, code" repeat="2" languages="javascript, json" />

#### Example usage

```javascript
try {
  const createResponse = await commerceClient.createOopeShippingCarrier({
    code: 'DPS',
    title: 'Demo Postal Service',
    stores: ['default'],
    countries: ['US', 'CA'],
    active: true,
    sort_order: 10,
    tracking_available: true,
    shipping_labels_available: true,
  });

  if (!createResponse.success) {
    return errorResponse(createResponse.statusCode, 'Failed to create shipping carrier');
  }

  console.log('Created shipping carrier:', createResponse.message);
} catch (error) {
  return errorResponse(HTTP_INTERNAL_ERROR, 'Error occurred while creating shipping carrier');
}
```

#### Example response

```json
{
  "success": true,
  "message": {
    "id": 1,
    "code": "DPS",
    "title": "Demo Postal Service",
    "stores": ["default"],
    "countries": ["US", "CA"],
    "active": true,
    "sort_order": 10,
    "tracking_available": true,
    "shipping_labels_available": true
  }
}
```

## List all shipping carriers

`getOopeShippingCarriers` retrieves a list of all out-of-process shipping carriers in the Adobe Commerce instance.

<CodeBlock slots="heading, code" repeat="2" languages="javascript, json" />

#### Example usage

```javascript
try {
  const listResponse = await commerceClient.getOopeShippingCarriers();
  if (!listResponse.success) {
    return errorResponse(listResponse.statusCode, 'Failed to list shipping carriers');
  }
  console.log('List of shipping carriers:', listResponse.message);
} catch (error) {
  return errorResponse(HTTP_INTERNAL_ERROR, 'Error occurred while listing shipping carriers');
}
```

#### Example response

```json
{
  "success": true,
  "message": [
    {
      "id": 1,
      "code": "DPS",
      "title": "Demo Postal Service",
      "stores": ["default"],
      "countries": ["US", "CA"],
      "sort_order": 10,
      "active": true,
      "tracking_available": true,
      "shipping_labels_available": true
    },
    {
      "id": 2,
      "code": "Fedex",
      "title": "Fedex Service",
      "stores": ["default"],
      "countries": ["US"],
      "sort_order": 50,
      "active": true,
      "tracking_available": false,
      "shipping_labels_available": true
    }
  ]
}
```

## Get an OOPE shipping carrier by code

`getOopeShippingCarrier` retrieves one out-of-process shipping carrier by `code` from the Adobe Commerce instance.

**Payload parameters:**

| Parameter | Type   | Description                                 |
| --------- | ------ | ------------------------------------------- |
| `code`    | String | Unique identifier for the shipping carrier. |

<CodeBlock slots="heading, code" repeat="2" languages="javascript, json" />

#### Example usage

```javascript
try {
  const getResponse = await commerceClient.getOopeShippingCarrier('DPS');
  if (!getResponse.success) {
    return errorResponse(getResponse.statusCode, 'Failed to retrieve shipping carrier');
  }
  console.log('Retrieved shipping carrier details:', getResponse.message);
} catch (error) {
  return errorResponse(HTTP_INTERNAL_ERROR, 'Error occurred while retrieving shipping carrier');
}
```

#### Example response

```json
{
  "success": true,
  "message": {
    "id": 1,
    "code": "DPS",
    "title": "Demo Postal Service",
    "stores": ["default"],
    "countries": ["US", "CA"],
    "sort_order": 10,
    "active": true,
    "tracking_available": true,
    "shipping_labels_available": true
  }
}
```
