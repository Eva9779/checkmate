'use server';
/**
 * @fileOverview An AI assistant flow that helps merchants understand failed transactions and provides resolution steps.
 *
 * - aiMerchantTransactionAssistant - A function that handles the AI transaction assistance process.
 * - AIMerchantTransactionAssistantInput - The input type for the aiMerchantTransactionAssistant function.
 * - AIMerchantTransactionAssistantOutput - The return type for the aiMerchantTransactionAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AIMerchantTransactionAssistantInputSchema = z.object({
  transactionId: z.string().describe('The unique identifier of the failed transaction.'),
  paymentGateway: z.string().describe('The name of the payment gateway used (e.g., Stripe, PayPal).'),
  failureCode: z
    .string()
    .describe('The error code provided by the payment gateway for the failed transaction.'),
  failureMessage: z
    .string()
    .describe('The detailed error message from the payment gateway explaining the failure.'),
  customerDescription: z
    .string()
    .optional()
    .describe('Any additional description or context provided by the customer regarding the failure.'),
});
export type AIMerchantTransactionAssistantInput = z.infer<
  typeof AIMerchantTransactionAssistantInputSchema
>;

const AIMerchantTransactionAssistantOutputSchema = z.object({
  explanation: z.string().describe('A clear and concise explanation of why the transaction failed.'),
  resolutionSteps: z
    .array(z.string())
    .describe('A list of actionable steps the merchant can take to resolve the issue.'),
  isCustomerActionable: z
    .boolean()
    .describe('Indicates whether the customer needs to take action to resolve the issue.'),
  customerFacingMessage: z
    .string()
    .optional()
    .describe(
      'A polite, customer-friendly message that can be relayed to the customer if they need to take action.'
    ),
});
export type AIMerchantTransactionAssistantOutput = z.infer<
  typeof AIMerchantTransactionAssistantOutputSchema
>;

export async function aiMerchantTransactionAssistant(
  input: AIMerchantTransactionAssistantInput
): Promise<AIMerchantTransactionAssistantOutput> {
  return aiMerchantTransactionAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiMerchantTransactionAssistantPrompt',
  input: {schema: AIMerchantTransactionAssistantInputSchema},
  output: {schema: AIMerchantTransactionAssistantOutputSchema},
  prompt: `You are an expert payment assistant for a tap and pay web application named PristinePay.
Your task is to analyze failed transaction details, explain the reason for failure, and provide clear, actionable resolution steps for the merchant. If the customer needs to take action, also provide a polite, customer-facing message.

Transaction Details:
- Transaction ID: {{{transactionId}}}
- Payment Gateway: {{{paymentGateway}}}
- Failure Code: {{{failureCode}}}
- Failure Message: {{{failureMessage}}}
{{#if customerDescription}}
- Customer Description: {{{customerDescription}}}
{{/if}}

Based on the above information, provide:
1. A simple explanation of why the transaction failed.
2. A list of specific steps the merchant can take to resolve this issue.
3. A boolean indicating if customer action is required.
4. If customer action is required, a polite message to relay to the customer.

Please provide your response in a JSON format matching the output schema.`,
});

const aiMerchantTransactionAssistantFlow = ai.defineFlow(
  {
    name: 'aiMerchantTransactionAssistantFlow',
    inputSchema: AIMerchantTransactionAssistantInputSchema,
    outputSchema: AIMerchantTransactionAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
