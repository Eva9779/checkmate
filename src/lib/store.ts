
export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  status: 'completed' | 'failed' | 'pending';
  items: { name: string; quantity: number; price: number }[];
  failureDetails?: {
    gateway: string;
    code: string;
    message: string;
  };
}

export const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Artisan Latte', price: 4.50, category: 'Coffee', imageUrl: 'https://picsum.photos/seed/coffee/400/300' },
  { id: '2', name: 'Blueberry Muffin', price: 3.25, category: 'Pastry', imageUrl: 'https://picsum.photos/seed/pastry/400/300' },
  { id: '3', name: 'Cold Brew', price: 4.00, category: 'Coffee', imageUrl: 'https://picsum.photos/seed/smoothie/400/300' },
  { id: '4', name: 'Sesame Bagel', price: 2.75, category: 'Pastry', imageUrl: 'https://picsum.photos/seed/bagel/400/300' },
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx_987654',
    amount: 7.75,
    date: new Date(Date.now() - 3600000).toISOString(),
    status: 'completed',
    items: [{ name: 'Artisan Latte', quantity: 1, price: 4.50 }, { name: 'Blueberry Muffin', quantity: 1, price: 3.25 }]
  },
  {
    id: 'tx_123456',
    amount: 15.50,
    date: new Date(Date.now() - 7200000).toISOString(),
    status: 'failed',
    items: [{ name: 'Bulk Coffee Beans', quantity: 1, price: 15.50 }],
    failureDetails: {
      gateway: 'Stripe',
      code: 'insufficient_funds',
      message: 'The customer card has insufficient funds for this transaction.'
    }
  },
  {
    id: 'tx_456789',
    amount: 4.00,
    date: new Date(Date.now() - 86400000).toISOString(),
    status: 'completed',
    items: [{ name: 'Cold Brew', quantity: 1, price: 4.00 }]
  }
];
