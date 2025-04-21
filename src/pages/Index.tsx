
import Calendar from "@/components/Calendar";

const Index = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight mb-2">月相-潮汐日历</h1>
        <p className="text-muted-foreground">
          探索月亮相位和潮汐预测，帮助您规划与自然现象相关的活动。
        </p>
      </div>
      
      <Calendar />
    </div>
  );
};

export default Index;
