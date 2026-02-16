
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, ShoppingCart, Trash2, Plus, Minus, CheckCircle2 } from "lucide-react"
import { MOCK_PRODUCTS, Product } from "@/lib/store"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import Image from "next/image"

interface CartItem extends Product {
  quantity: number;
}

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [showTapDialog, setShowTapDialog] = useState(false)

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta)
        return { ...item, quantity: newQty }
      }
      return item
    }))
  }

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  const handleInitiatePayment = () => {
    if (cart.length === 0) return
    setShowTapDialog(true)
  }

  const handleSimulatePayment = () => {
    setIsProcessing(true)
    setTimeout(() => {
      setIsProcessing(false)
      setShowTapDialog(false)
      setPaymentSuccess(true)
      setCart([])
      setTimeout(() => setPaymentSuccess(false), 3000)
    }, 2500)
  }

  return (
    <div className="grid h-[calc(100vh-140px)] gap-6 lg:grid-cols-12">
      <div className="lg:col-span-8 space-y-4 overflow-auto pr-2">
        <div className="flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur-sm z-10 py-2">
          <h2 className="text-2xl font-bold">Quick Selection</h2>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">Beverages</Button>
            <Button variant="outline" size="sm">Pastries</Button>
            <Button variant="outline" size="sm">Merchandise</Button>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {MOCK_PRODUCTS.map((product) => (
            <Card key={product.id} className="cursor-pointer border-none shadow-sm hover:ring-2 hover:ring-primary/20 transition-all overflow-hidden" onClick={() => addToCart(product)}>
              <div className="relative aspect-video">
                <Image 
                  src={product.imageUrl} 
                  alt={product.name} 
                  width={400}
                  height={300}
                  className="object-cover"
                />
              </div>
              <CardContent className="p-3">
                <p className="font-semibold text-sm line-clamp-1">{product.name}</p>
                <p className="text-primary font-bold">${product.price.toFixed(2)}</p>
              </CardContent>
            </Card>
          ))}
          <Card className="flex flex-col items-center justify-center border-dashed border-2 hover:bg-muted/50 cursor-pointer">
            <Plus className="h-8 w-8 text-muted-foreground mb-2" />
            <p className="font-medium text-sm">Custom Amount</p>
          </Card>
        </div>
      </div>

      <div className="lg:col-span-4 flex flex-col gap-4 h-full">
        <Card className="flex-1 border-none shadow-lg flex flex-col overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" /> Current Order
              </CardTitle>
              <Badge variant="secondary" className="bg-white/20 text-white border-none">{cart.length} items</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto p-0">
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-8 text-center">
                <ShoppingCart className="h-12 w-12 mb-4 opacity-20" />
                <p>No items in current order</p>
              </div>
            ) : (
              <div className="divide-y">
                {cart.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between group">
                    <div className="space-y-1">
                      <p className="font-medium">{item.name}</p>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center border rounded-full h-8 overflow-hidden">
                          <button 
                            className="px-2 hover:bg-muted" 
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, -1) }}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                          <button 
                            className="px-2 hover:bg-muted" 
                            onClick={(e) => { e.stopPropagation(); updateQuantity(item.id, 1) }}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-sm text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col gap-3 pt-6 border-t bg-muted/30">
            <div className="w-full space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
            <Button 
              className="w-full h-14 text-lg font-bold gap-3 shadow-lg shadow-primary/20" 
              disabled={cart.length === 0}
              onClick={handleInitiatePayment}
            >
              <Smartphone className="h-6 w-6" /> Charge ${total.toFixed(2)}
            </Button>
          </CardFooter>
        </Card>
      </div>

      <Dialog open={showTapDialog} onOpenChange={setShowTapDialog}>
        <DialogContent className="sm:max-w-md text-center p-12">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Ready to Scan</DialogTitle>
            <DialogDescription className="text-lg">
              Hold customer device or card near the reader
            </DialogDescription>
          </DialogHeader>
          <div className="py-12 flex flex-col items-center">
            <div className={`relative h-32 w-32 rounded-full bg-primary/10 flex items-center justify-center ${isProcessing ? '' : 'tap-animation'}`}>
              <Smartphone className={`h-16 w-16 text-primary ${isProcessing ? 'animate-pulse' : ''}`} />
            </div>
            <div className="mt-8 space-y-2">
              <p className="text-2xl font-bold">${total.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Waiting for tap...</p>
            </div>
          </div>
          {!isProcessing && (
            <Button variant="outline" className="w-full" onClick={handleSimulatePayment}>
              Simulate Tap
            </Button>
          )}
          {isProcessing && (
            <p className="text-primary font-medium">Processing secure payment...</p>
          )}
        </DialogContent>
      </Dialog>

      {paymentSuccess && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white p-6 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-bottom-full duration-500">
          <div className="bg-white/20 p-2 rounded-full">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="font-bold text-lg">Payment Successful</p>
            <p className="text-sm opacity-90">Transaction completed successfully.</p>
          </div>
        </div>
      )}
    </div>
  )
}
