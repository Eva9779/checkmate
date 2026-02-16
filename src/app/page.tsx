
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Delete, Loader2, ShieldCheck, QrCode, AlertCircle } from "lucide-react"
import { createPaymentIntent, checkPaymentStatus } from "@/app/actions/payment"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import Image from "next/image"

export default function TerminalPage() {
  const [amount, setAmount] = useState("0.00")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [currentIntentId, setCurrentIntentId] = useState<string | null>(null)
  const [checkoutUrl, setCheckoutUrl] = useState<string>("")
  const { toast } = useToast()

  // Polling for payment status when QR is shown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showQR && currentIntentId) {
      interval = setInterval(async () => {
        const status = await checkPaymentStatus(currentIntentId);
        if (status === 'succeeded') {
          setPaymentSuccess(true);
          setShowQR(false);
          setAmount("0.00");
          setCurrentIntentId(null);
          setTimeout(() => setPaymentSuccess(false), 5000);
        }
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [showQR, currentIntentId]);

  const handleKeyPress = (num: string) => {
    if (amount === "0.00") {
      if (num === ".") return setAmount("0.")
      setAmount(num)
    } else {
      if (num === "." && amount.includes(".")) return
      setAmount(prev => (prev + num).slice(0, 7))
    }
  }

  const handleDelete = () => {
    if (amount.length <= 1 || amount === "0.00") {
      setAmount("0.00")
    } else {
      const newVal = amount.slice(0, -1)
      setAmount(newVal === "" ? "0.00" : newVal)
    }
  }

  const handleCharge = async () => {
    const numericAmount = parseFloat(amount);
    if (numericAmount <= 0) {
      toast({ variant: "destructive", title: "Invalid Amount", description: "Please enter an amount to charge." });
      return;
    }

    setIsProcessing(true);
    try {
      const result = await createPaymentIntent(numericAmount);
      if (result.success && result.intentId) {
        setCurrentIntentId(result.intentId);
        const baseUrl = window.location.origin;
        setCheckoutUrl(`${baseUrl}/pay/${result.intentId}`);
        setShowQR(true);
      } else {
        toast({ 
          variant: "destructive", 
          title: "Payment Error", 
          description: result.error || "Failed to create payment. Ensure Stripe keys are set in Vercel." 
        });
      }
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "Connection Error", 
        description: "Could not reach payment server. Check your environment variables." 
      });
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 font-sans antialiased relative">
      <Card className="w-full max-w-md border-none shadow-2xl overflow-hidden rounded-[3.5rem] bg-white">
        <CardHeader className="bg-black p-10 text-center text-white space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
               <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
               <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">PristinePay Live</span>
            </div>
            <ShieldCheck className="h-4 w-4 text-white/20" />
          </div>
          <div className="flex flex-col items-center justify-center py-6">
             <div className="flex items-end justify-center text-8xl font-black tracking-tighter">
                <span className="text-3xl mb-3 mr-2 opacity-20">$</span>
                {amount}
              </div>
          </div>
        </CardHeader>

        <CardContent className="p-10">
          <div className="grid grid-cols-3 gap-6">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", ".", "0"].map((num) => (
              <Button
                key={num}
                variant="ghost"
                className="h-24 text-4xl font-black rounded-3xl transition-transform active:scale-90"
                onClick={() => handleKeyPress(num)}
              >
                {num}
              </Button>
            ))}
            <Button
              variant="ghost"
              className="h-24 rounded-3xl text-zinc-300 hover:text-black active:scale-90"
              onClick={handleDelete}
            >
              <Delete className="h-8 w-8" />
            </Button>
          </div>
        </CardContent>

        <CardFooter className="p-10 pt-0">
          <Button 
            className="w-full h-24 text-2xl font-black rounded-[2.5rem] transition-all active:scale-[0.96] gap-4 bg-black hover:bg-zinc-900 text-white"
            disabled={isProcessing}
            onClick={handleCharge}
          >
            {isProcessing ? <Loader2 className="h-8 w-8 animate-spin" /> : <QrCode className="h-8 w-8" />}
            Generate Contactless QR
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={showQR} onOpenChange={setShowQR}>
        <DialogContent className="sm:max-w-md text-center p-12 rounded-[3rem] border-none">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black tracking-tighter uppercase mb-2">Customer Scan</DialogTitle>
            <p className="text-zinc-400 font-bold text-sm uppercase tracking-widest">Contactless Payment Ready</p>
          </DialogHeader>
          <div className="py-10 flex flex-col items-center space-y-8">
            <div className="p-6 bg-white rounded-[2rem] shadow-xl border-4 border-zinc-50">
               {checkoutUrl && (
                 <Image 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(checkoutUrl)}`}
                  alt="Payment QR Code"
                  width={250}
                  height={250}
                  className="rounded-xl"
                  unoptimized
                 />
               )}
            </div>
            <div className="space-y-1">
              <p className="text-4xl font-black tracking-tighter">${amount}</p>
              <p className="text-sm text-zinc-400 font-medium">Scan for Apple Pay / Google Pay</p>
            </div>
          </div>
          <Button variant="ghost" className="text-zinc-400 font-bold" onClick={() => setShowQR(false)}>
            Cancel Transaction
          </Button>
        </DialogContent>
      </Dialog>

      {paymentSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 animate-in fade-in duration-500">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="bg-green-500 p-8 rounded-full text-white shadow-2xl">
              <CheckCircle2 className="h-20 w-20" />
            </div>
            <div className="space-y-2">
              <h2 className="text-6xl font-black tracking-tighter uppercase">Approved</h2>
              <p className="text-zinc-400 font-bold uppercase tracking-widest text-xs">Transaction Complete</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
