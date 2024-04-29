"use client"

import type { Tables } from "@/supabase/types"
import { getStripe } from "@/utils/stripe/client"
import { checkoutWithStripe } from "@/utils/stripe/server"
import { getErrorRedirect } from "@/utils/helpers"
import { User } from "@supabase/supabase-js"
import { useRouter, usePathname } from "next/navigation"
import { useState } from "react"

import { CheckIcon } from "@heroicons/react/20/solid"

const includedFeatures = ["Macro calculator", "24/7 support"]
type Subscription = Tables<"subscriptions">
type Product = Tables<"products">
type Price = Tables<"prices">
interface ProductWithPrices extends Product {
  prices: Price[]
}
interface PriceWithProduct extends Price {
  products: Product | null
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null
}

interface Props {
  user: User | null | undefined
  products: ProductWithPrices[] | null
}

type BillingInterval = "lifetime" | "year" | "month"

export default function Offers({ user, products }: Props) {
  const intervals = Array.from(
    new Set(
      products?.flatMap(product =>
        product?.prices?.map(price => price?.interval)
      )
    )
  )
  const router = useRouter()
  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("month")
  const [priceIdLoading, setPriceIdLoading] = useState<string>()
  const currentPath = usePathname()

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id)

    if (!user) {
      setPriceIdLoading(undefined)
      return router.push("/login")
    }

    const { errorRedirect, sessionId } = await checkoutWithStripe(
      price,
      currentPath
    )

    if (errorRedirect) {
      setPriceIdLoading(undefined)
      return router.push(errorRedirect)
    }

    if (!sessionId) {
      setPriceIdLoading(undefined)
      return router.push(
        getErrorRedirect(
          currentPath,
          "An unknown error occurred.",
          "Please try again later or contact a system administrator."
        )
      )
    }

    const stripe = await getStripe()
    stripe?.redirectToCheckout({ sessionId })

    setPriceIdLoading(undefined)
  }

  if (!products?.length) {
    return (
      <section className="bg-black">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-24 lg:px-8">
          <div className="sm:align-center sm:flex sm:flex-col"></div>
          <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{" "}
            <a
              className="text-pink-500 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
      </section>
    )
  } else {
    return (
      <div className="mt-12 flex w-full flex-wrap justify-center gap-6 space-y-4 sm:mt-16 sm:space-y-0 lg:mx-auto lg:max-w-4xl xl:mx-0 xl:max-w-none">
        {products.map(product => {
          const price = product?.prices?.find(
            price => price.interval === billingInterval
          )
          if (!price) return null
          const priceString = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: price.currency!,
            minimumFractionDigits: 0
          }).format((price?.unit_amount || 0) / 100)
          return (
            <div key={product.id} className="w-full">
              <div className=" py-24">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                  <div className="mx-auto max-w-2xl sm:text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                      Simple no-tricks pricing
                    </h2>
                    <p className="mt-6 text-lg leading-8 text-gray-600">
                      Distinctio et nulla eum soluta et neque labore quibusdam.
                      Saepe et quasi iusto modi velit ut non voluptas in.
                      Explicabo id ut laborum.
                    </p>
                  </div>
                  <div className="mx-auto mt-16 rounded-3xl bg-white ring-1 ring-gray-200 sm:mt-20 lg:mx-0 lg:flex lg:max-w-none">
                    <div className="p-8 sm:p-10 lg:flex-auto">
                      <h3 className="text-2xl font-bold tracking-tight text-gray-900">
                        {" "}
                        {product.name}
                      </h3>
                      <p className="mt-6 text-base leading-7 text-gray-600">
                        {product.description}
                      </p>
                      <div className="mt-10 flex items-center gap-x-4">
                        <h4 className="flex-none text-sm font-semibold leading-6 text-indigo-600">
                          What’s included
                        </h4>
                        <div className="h-px flex-auto bg-gray-100" />
                      </div>
                      <ul
                        role="list"
                        className="mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
                      >
                        {includedFeatures.map(feature => (
                          <li key={feature} className="flex gap-x-3">
                            <CheckIcon
                              className="h-6 w-5 flex-none text-indigo-600"
                              aria-hidden="true"
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="-mt-2 flex  p-2 lg:mt-0 lg:w-full lg:max-w-md lg:shrink-0">
                      <div className="w-full rounded-2xl bg-gray-50 py-10 text-center ring-1 ring-inset ring-gray-900/5 lg:flex lg:flex-col lg:justify-center lg:py-16">
                        <div className="mx-auto max-w-xs px-8">
                          <p className="mt-6 flex items-baseline justify-center gap-x-2">
                            <span className="text-5xl font-bold tracking-tight text-gray-900">
                              {priceString}
                            </span>
                            <span className="text-sm font-semibold leading-6 tracking-wide text-gray-600">
                              /{billingInterval}
                            </span>
                          </p>
                          <button
                            onClick={() => handleStripeCheckout(price)}
                            className="mt-10 block w-full rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Get access
                          </button>
                          <p className="mt-6 text-xs leading-5 text-gray-600">
                            Invoices and receipts available for easy company
                            reimbursement
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }
}
