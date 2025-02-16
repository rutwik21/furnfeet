"use client"
import { PRODUCT_CATEGORIES } from '@/config';
import { cn, formatPrice } from '@/lib/utils';
import { Button } from '../../components/ui/button';
import { Link, X, Check, Loader2 } from 'lucide-react';
import items from 'razorpay/dist/types/items';
import products from 'razorpay/dist/types/products';
import { useState } from 'react';

const AddressPage = () => {
  const [addresses, setAddresses] = useState([
    // Sample addresses, you would get these from an API in a real-world app.
    { id: 1, name: 'John Doe', contact: '1234567890', addressLine1: '123 Main St', addressLine2: 'Apt 101', city: 'New York', state: 'NY', pinCode: '10001' },
    { id: 2, name: 'Jane Smith', contact: '0987654321', addressLine1: '456 Elm St', addressLine2: 'Apt 202', city: 'San Francisco', state: 'CA', pinCode: '94101' },
  ]);
  
  const [showForm, setShowForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    name: '',
    contact: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pinCode: '',
  });

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAddress = () => {
    setAddresses((prev) => [...prev, { ...newAddress, id: prev.length + 1 }]);
    setShowForm(false);
    setNewAddress({
      name: '',
      contact: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: '',
      pinCode: '',
    });
  };

  return (
    <div className='bg-white'>
      <div className='mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8'>
        <h1 className='text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl'>
          Address
        </h1>

        <div className='mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16'>
          <div className='rounded-lg border-2 border-dashed border-zinc-200 p-12 lg:col-span-7'>
            <div className="container mx-auto px-4 py-8">
                <Button
                    className="mb-4  text-white py-2 px-4 rounded-md"
                    onClick={() => setShowForm(!showForm)}
                    >
                    {showForm ? 'Cancel' : 'Add New Address'}
                </Button>
                
                {showForm && (
                    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold mb-4">Add New Address</h2>
                    <form>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={newAddress.name}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md"
                            required
                        />
                        <input
                            type="text"
                            name="contact"
                            placeholder="Contact"
                            value={newAddress.contact}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md"
                            required
                        />
                        <input
                            type="text"
                            name="addressLine1"
                            placeholder="Address Line 1"
                            value={newAddress.addressLine1}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md"
                            required
                        />
                        <input
                            type="text"
                            name="addressLine2"
                            placeholder="Address Line 2"
                            value={newAddress.addressLine2}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md"
                        />
                        <input
                            type="text"
                            name="city"
                            placeholder="City"
                            value={newAddress.city}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md"
                            required
                        />
                        <input
                            type="text"
                            name="state"
                            placeholder="State"
                            value={newAddress.state}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md"
                            required
                        />
                        <input
                            type="text"
                            name="pinCode"
                            placeholder="Pin Code"
                            value={newAddress.pinCode}
                            onChange={handleInputChange}
                            className="border p-2 rounded-md"
                            required
                        />
                        </div>
                        <button
                        type="button"
                        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md"
                        onClick={handleAddAddress}
                        >
                        Add Address
                        </button>
                    </form>
                    </div>
                )}

                <div className="space-y-4">
                    {addresses.map((address) => (
                    <div key={address.id} className="bg-white shadow-md rounded-lg p-6">
                        <h3 className="text-xl font-semibold">{address.name}</h3>
                        <p>{address.contact}</p>
                        <p>{address.addressLine1}, {address.addressLine2}</p>
                        <p>{address.city}, {address.state} - {address.pinCode}</p>
                    </div>
                    ))}
                </div>
            </div>

          </div>


          <section className='mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8'>
            <h2 className='text-lg font-medium text-gray-900'>
              Order summary
            </h2>

            <div className='mt-6 space-y-4'>
              <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-600'>
                  Subtotal
                </p>
                
              </div>

              <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
                <div className='flex items-center text-sm text-muted-foreground'>
                  <span>Flat Transaction Fee</span>
                </div>
                
              </div>

              <div className='flex items-center justify-between border-t border-gray-200 pt-4'>
                <div className='text-base font-medium text-gray-900'>
                  Order Total
                </div>
                
              </div>
            </div>

            <div className='mt-6'>
              <Button
                className='w-full'
                >
                Checkout
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
    
  );
};

export default AddressPage;
