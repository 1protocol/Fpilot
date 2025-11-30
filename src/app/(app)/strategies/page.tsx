import { PageHeader } from "@/components/shared/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StrategyList from "@/components/strategies/strategy-list";
import StrategyGenerator from "@/components/strategies/strategy-generator";

export default function StrategiesPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Trading Strategies"
        description="Manage, create, and optimize your automated trading strategies."
      />
      <Tabs defaultValue="my-strategies">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="my-strategies">My Strategies</TabsTrigger>
          <TabsTrigger value="generate">Generate with AI</TabsTrigger>
        </TabsList>
        <TabsContent value="my-strategies" className="mt-6">
          <StrategyList />
        </TabsContent>
        <TabsContent value="generate" className="mt-6">
          <StrategyGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}
