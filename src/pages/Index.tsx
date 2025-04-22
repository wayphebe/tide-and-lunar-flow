
import Calendar from "@/components/Calendar";

const Index = () => {
  return (
    <div className="space-y-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light tracking-wide mb-3 bg-clip-text text-transparent bg-gradient-to-r from-moon to-moon-dark">月相-潮汐日历</h1>
        <p className="text-muted-foreground/80 text-sm">
          探索月亮相位和潮汐预测，帮助您规划与自然现象相关的活动。
        </p>
      </div>
      
      <Calendar />
    </div>
  );
};

export default Index;
