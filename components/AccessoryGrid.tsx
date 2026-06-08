import AccessoryCard from "@/components/AccessoryCard";

type Accessory = {
  id: string;
  name: string;
  subtitle: string | null;
  price: number;
  image_url: string | null;
};

export default function AccessoryGrid({ accessories }: { accessories: Accessory[] }) {
  if (!accessories.length) return null;
  return (
    <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
      {accessories.map((a) => (
        <AccessoryCard key={a.id} accessory={a} />
      ))}
    </div>
  );
}
