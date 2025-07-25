import { useState, useEffect } from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useQuery } from "@tanstack/react-query";
import { REACT_QUERY_KEYS } from "@/api/react-query-keys";
import { apiUser } from "@/api/User";

export const StripeProviderPayment = ({ children }) => {
  const [publishableKey, setPublishableKey] = useState(
    "pk_test_51RjMc84FQW7j8v47mybbU4PfB4eNYFJQMwv9Ls8Fh2SRm0WndiT70FVyVquQn191o9nGVdBbvQfQJhyUkCraremy00GH6FaFQE"
  );

  const { data } = useQuery({
    queryKey: [REACT_QUERY_KEYS.payment.getClientIdStripe("stripe")],
    queryFn: () => apiUser.getClientIdStripe(),
    ...{
      select: (data) => data.data,
    },
  });

  useEffect(() => {
    if (!data?.error) setPublishableKey(data?.items);
  }, [data]);

  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.identifier" // required for Apple Pay
      urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    >
      {/* Your app code here */}
      {children}
    </StripeProvider>
  );
};

export default StripeProviderPayment;
