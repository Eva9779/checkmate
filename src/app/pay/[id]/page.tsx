
"use client"

import { useEffect, useState, useRef } from "react"
import { useParams } from "next/navigation"
import { loadStripe, Stripe, PaymentRequest } from "@stripe/stripe-js"
import { getPaymentDetails } from "@/app/actions/payment"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Smartphone, CheckCircle2, Loader2, ShieldCheck, CreditCard, AlertCircle, WifiOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

/**
 * STRIPE PUBLISHABLE KEY
 * Pulled from environment variables for security.
 * Ensure you use NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in Vercel.
 */
const PUBLISHABLE_KEY = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "";
const stripePromise = loadStripe(PUBLISHABLE_KEY);

export default function CustomerPaymentPage() {
  const params = useParams()
  const intentId = params.id as string
  
  const [stripe, setStripe] = useState<Stripe | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [amount, setAmount] = useState<number | null>(null)
  
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [canPayNative, setCanPayNative] = useState<boolean>(false)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)
  const [isNetworkBlocked, setIsNetworkBlocked] = useState(false)
  
  const paymentRequestRef = useRef<PaymentRequest | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (!PUBLISHABLE_KEY) {
      setErrorDetails("Payment system not configured. Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in Vercel settings.");
      return;
    }

    let isMounted = true;
    
    const timeout = setTimeout(() => {
      if (!stripe && isMounted) setIsNetworkBlocked(true);
    }, 8000);

    stripePromise.then((s) => {
      if (!isMounted) return;
      setStripe(s);
      setIsNetworkBlocked(false);
      clearTimeout(timeout);
    }).catch(() => {
      if (!isMounted) return;
      setIsNetworkBlocked(true);
      clearTimeout(timeout);
    });
    
    async function fetchDetails() {
      const result = await getPaymentDetails(intentId)
      if (!isMounted) return;
      if (result.success) {
        setClientSecret(result.clientSecret!)
        setAmount(result.amount!)
      } else {
        setErrorDetails(result.error || "Invalid or expired link. Ensure STRIPE_SECRET_KEY is set on server.")
      }
    }
    fetchDetails()
    
    return () => {
      isMounted = false;
      clearTimeout(timeout);
    };
  }, [intentId]);

  useEffect(() => {
    if (!stripe || !amount || !clientSecret) return

    const pr = stripe.paymentRequest({
      country: 'US',
      currency: 'usd',
      total: { 
        label: 'PristinePay Terminal Charge', 
        amount: Math.round(amount * 100) 
      },
      requestPayerName: true,
      requestPayerEmail: true,
    })

    pr.on('paymentmethod', async (ev) => {
      setIsProcessing(true)
      const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
        clientSecret,
        { payment_method: ev.paymentMethod.id },
        { handleActions: false }
      )

      if (confirmError) {
        ev.complete('fail')
        setErrorDetails(confirmError.message || "Payment Declined")
        toast({ 
          variant: "destructive", 
          title: "Transaction Declined", 
          description: confirmError.message || "Check your connection and try again." 
        })
        setIsProcessing(false)
      } else {
        ev.complete('success')
        if (paymentIntent.status === "requires_action") {
          const { error: finalError } = await stripe.confirmCardPayment(clientSecret)
          if (finalError) {
            setErrorDetails(finalError.message || "Final confirmation failed")
            setIsProcessing(false)
          } else {
            setPaymentSuccess(true)
            setIsProcessing(false)
          }
        } else {
          setPaymentSuccess(true)
          setIsProcessing(false)
        }
      }
    })

    pr.canMakePayment().then(result => {
      if (result) {
        paymentRequestRef.current = pr
        setCanPayNative(true)
      }
    })
  }, [stripe, amount, clientSecret, toast])

  const handleTapToPay = async () => {
    if (!paymentRequestRef.current) {
      toast({ 
        variant: "destructive", 
        title: "Scanner Not Ready", 
        description: "Please ensure you are using a secure mobile browser (Safari/iOS or Chrome/Android)." 
      })
      return
    }
    
    setIsProcessing(true)
    setErrorDetails(null)
    paymentRequestRef.current.show()
  }

  if (!amount && !errorDetails) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest text-center">
            {isNetworkBlocked ? "Resolving secure connection..." : "Securing Terminal..."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 font-sans antialiased">
      <Card className="w-full max-w-md border-none shadow-2xl overflow-hidden rounded-[3.5rem] bg-white">
        <CardHeader className="bg-black p-10 text-center text-white space-y-4">
          <div className="flex justify-center">
            <CreditCard className="h-12 w-12 text-white opacity-40" />
          </div>
          <h1 className="text-2xl font-black tracking-tighter uppercase">PristinePay</h1>
          <p className="text-zinc-400 font-bold text-[10px] uppercase tracking-[0.2em]">Live Contactless Merchant</p>
        </CardHeader>

        <CardContent className="p-10 text-center space-y-8">
          <div className="space-y-1">
            <p className="text-6xl font-black tracking-tighter">${amount?.toFixed(2)}</p>
            <p className="text-zinc-400 font-medium text-sm">Authorized Terminal Charge</p>
          </div>

          {isNetworkBlocked ? (
            <div className="bg-amber-50 p-6 rounded-[2rem] border border-amber-100 flex flex-col items-center gap-3">
              <WifiOff className="h-6 w-6 text-amber-500" />
              <div className="space-y-1">
                <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Connection Restricted</p>
                <p className="text-sm font-medium text-amber-800 leading-tight">
                  Your network or VPN may be blocking the secure connection.
                </p>
              </div>
            </div>
          ) : errorDetails ? (
            <div className="bg-red-50 p-6 rounded-[2rem] border border-red-100 flex flex-col items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <div className="space-y-1">
                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest">Transaction Blocked</p>
                <p className="text-sm font-medium text-red-800 leading-tight whitespace-pre-line">
                  {errorDetails}
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-zinc-50 p-6 rounded-[2rem] border border-zinc-100 flex flex-col items-center gap-3">
              <ShieldCheck className="h-6 w-6 text-green-500" />
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.1em] text-center">
                Secure Encrypted Connection<br/>Production Verified
              </p>
            </div>
          )}
        </CardContent>

        <CardFooter className="p-10 pt-0 flex flex-col gap-4">
          <Button 
            className="w-full h-24 text-2xl font-black rounded-[2.5rem] bg-black hover:bg-zinc-900 text-white flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-transform"
            disabled={isProcessing || paymentSuccess || (!canPayNative && !errorDetails)}
            onClick={handleTapToPay}
          >
            {isProcessing ? <Loader2 className="h-8 w-8 animate-spin" /> : <Smartphone className="h-8 w-8" />}
            {paymentSuccess ? "Approved" : "Tap to Pay"}
          </Button>
          
          {!canPayNative && !errorDetails && !isNetworkBlocked && (
            <div className="text-center space-y-2">
              <p className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">
                Unsupported Browser
              </p>
              <p className="text-[10px] text-zinc-500 font-medium">
                Please use Safari (iOS) or Chrome (Android) for contactless payment.
              </p>
            </div>
          )}
        </CardFooter>
      </Card>

      {paymentSuccess && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/95 animate-in fade-in duration-500">
          <div className="flex flex-col items-center text-center space-y-8">
            <div className="bg-green-500 p-8 rounded-full text-white shadow-2xl scale-up-center">
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
