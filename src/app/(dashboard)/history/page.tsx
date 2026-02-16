
"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, AlertTriangle, Sparkles, ChevronRight } from "lucide-react"
import { MOCK_TRANSACTIONS, Transaction } from "@/lib/store"
import { format } from "date-fns"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { aiMerchantTransactionAssistant, AIMerchantTransactionAssistantOutput } from "@/ai/flows/ai-merchant-transaction-assistant"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

export default function HistoryPage() {
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)
  const [aiAnalysis, setAiAnalysis] = useState<AIMerchantTransactionAssistantOutput | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleOpenDetails = async (tx: Transaction) => {
    setSelectedTx(tx)
    setAiAnalysis(null)
    
    if (tx.status === 'failed' && tx.failureDetails) {
      setIsAnalyzing(true)
      try {
        const result = await aiMerchantTransactionAssistant({
          transactionId: tx.id,
          paymentGateway: tx.failureDetails.gateway,
          failureCode: tx.failureDetails.code,
          failureMessage: tx.failureDetails.message
        })
        setAiAnalysis(result)
      } catch (err) {
        console.error("AI Analysis failed", err)
      } finally {
        setIsAnalyzing(false)
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transaction History</h1>
          <p className="text-muted-foreground">A record of all your business sales and terminal activity.</p>
        </div>
        <Button variant="outline" className="gap-2">Export Data</Button>
      </div>

      <Card className="border-none shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Date & Time</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {MOCK_TRANSACTIONS.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{tx.id}</TableCell>
                  <TableCell className="text-sm">{format(new Date(tx.date), 'MMM d, h:mm a')}</TableCell>
                  <TableCell className="font-bold">${tx.amount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={tx.status === 'completed' ? 'default' : tx.status === 'failed' ? 'destructive' : 'secondary'}
                      className={tx.status === 'completed' ? 'bg-green-100 text-green-700 hover:bg-green-200 border-none' : ''}
                    >
                      {tx.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2"
                      onClick={() => handleOpenDetails(tx)}
                    >
                      <Eye className="h-4 w-4" /> Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedTx} onOpenChange={(open) => !open && setSelectedTx(null)}>
        <DialogContent className="sm:max-w-2xl p-0 overflow-hidden border-none shadow-2xl">
          {selectedTx && (
            <div className="flex flex-col">
              <div className={`p-8 text-white ${selectedTx.status === 'completed' ? 'bg-primary' : 'bg-destructive'}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm opacity-80 uppercase tracking-wider font-bold mb-1">Receipt Summary</p>
                    <h2 className="text-4xl font-bold">${selectedTx.amount.toFixed(2)}</h2>
                  </div>
                  <Badge variant="outline" className="border-white text-white">
                    {selectedTx.status.toUpperCase()}
                  </Badge>
                </div>
                <div className="mt-6 flex gap-8 text-sm opacity-90">
                  <div>
                    <p className="font-medium">Transaction ID</p>
                    <p className="font-mono">{selectedTx.id}</p>
                  </div>
                  <div>
                    <p className="font-medium">Date</p>
                    <p>{format(new Date(selectedTx.date), 'PPpp')}</p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <h3 className="text-lg font-bold mb-4">Items Summary</h3>
                <ScrollArea className="max-h-48 mb-8">
                  <div className="space-y-3">
                    {selectedTx.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-sm">
                        <div className="flex gap-2">
                          <span className="text-muted-foreground font-medium">{item.quantity}x</span>
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {selectedTx.status === 'failed' && (
                  <>
                    <Separator className="my-6" />
                    <Card className="bg-accent/5 border-primary/20">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
                          <Sparkles className="h-4 w-4" /> AI Payment Assistant
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {isAnalyzing ? (
                          <div className="flex items-center gap-3 py-4">
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
                            <p className="text-sm text-muted-foreground italic">Analyzing gateway logs for resolution...</p>
                          </div>
                        ) : aiAnalysis ? (
                          <div className="space-y-4 animate-in fade-in duration-500">
                            <div className="bg-white p-4 rounded-lg border shadow-sm">
                              <p className="text-sm font-bold mb-1">Issue Explained:</p>
                              <p className="text-sm text-muted-foreground leading-relaxed">{aiAnalysis.explanation}</p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-bold mb-2 flex items-center gap-2">
                                <ChevronRight className="h-4 w-4 text-primary" /> Recommended Steps:
                              </p>
                              <ul className="space-y-1 pl-6">
                                {aiAnalysis.resolutionSteps.map((step, i) => (
                                  <li key={i} className="text-sm text-muted-foreground list-disc">{step}</li>
                                ))}
                              </ul>
                            </div>

                            {aiAnalysis.isCustomerActionable && (
                              <div className="p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
                                <p className="text-sm font-bold mb-1 flex items-center gap-2">
                                  <AlertTriangle className="h-4 w-4 text-primary" /> Relay to Customer:
                                </p>
                                <p className="text-sm italic">"{aiAnalysis.customerFacingMessage}"</p>
                              </div>
                            )}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">Unable to generate automated analysis at this time.</p>
                        )}
                      </CardContent>
                    </Card>
                  </>
                )}

                {selectedTx.status === 'completed' && (
                  <div className="flex justify-center pt-4">
                    <Button variant="outline" className="w-full">Email Receipt</Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
