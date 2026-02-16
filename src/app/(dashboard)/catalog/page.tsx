
"use client"

import { useState } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Edit2, Trash2, Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MOCK_PRODUCTS, Product } from "@/lib/store"
import Image from "next/image"

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>(MOCK_PRODUCTS)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Product Catalog</h1>
          <p className="text-muted-foreground">Manage your products and pricing.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input 
            placeholder="Search products..." 
            className="pl-9 h-11"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 h-11">
          <Filter className="h-4 w-4" /> Filters
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image 
                src={product.imageUrl} 
                alt={product.name}
                width={400}
                height={300}
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                data-ai-hint={product.category}
              />
              <div className="absolute right-2 top-2">
                <Badge className="bg-white/90 text-primary hover:bg-white">{product.category}</Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
              </div>
            </CardHeader>
            <CardFooter className="flex justify-end gap-2 pt-0">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        ))}
        
        {filteredProducts.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="mb-4 rounded-full bg-muted p-6">
              <Search className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold">No products found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filters.</p>
          </div>
        )}
      </div>
    </div>
  )
}
