
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { format, addDays, subDays } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TideTimeline } from "@/components/TideTimeline";
import { predictTides, TidePoint } from "@/utils/tidePredictor";
import { calculateMoonPhase } from "@/utils/lunarPhaseCalculator";
import { useLocationStore } from "@/stores/locationStore";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const TideDetails = () => {
  const { date } = useParams<{ date: string }>();
  const { currentLocation } = useLocationStore();
  const [tideData, setTideData] = useState<TidePoint[] | null>(null);
  
  useEffect(() => {
    if (date && currentLocation) {
      const dateObj = new Date(date);
      const tides = predictTides(dateObj, currentLocation);
      setTideData(tides);
    }
  }, [date, currentLocation]);
  
  if (!date || !currentLocation || !tideData) {
    return <div className="text-center py-8">加载中...</div>;
  }
  
  const dateObj = new Date(date);
  const formattedDate = format(dateObj, "yyyy年MM月dd日");
  const prevDate = format(subDays(dateObj, 1), "yyyy-MM-dd");
  const nextDate = format(addDays(dateObj, 1), "yyyy-MM-dd");
  
  // Get moon phase for context
  const moonPhase = calculateMoonPhase(dateObj);
  
  // Find high and low tides
  const highTides = tideData.filter(tide => tide.isHighTide);
  const lowTides = tideData.filter(tide => !tide.isHighTide);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link to={`/tide/${prevDate}`}>
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            前一天
          </Link>
        </Button>
        
        <h1 className="text-2xl font-bold">{formattedDate}</h1>
        
        <Button variant="outline" asChild>
          <Link to={`/tide/${nextDate}`}>
            后一天
            <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>潮汐预测</CardTitle>
          <CardDescription>位置: {currentLocation.name} | 月相: {moonPhase.name} {moonPhase.emoji}</CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <TideTimeline tides={tideData} />
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>高潮时间</CardTitle>
            <CardDescription>当日高潮预测</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highTides.map((tide, index) => (
                <div key={index} className="flex justify-between items-center p-2 border-b last:border-0">
                  <span className="text-lg font-medium">{tide.time}</span>
                  <span className="text-lg">{tide.height.toFixed(2)}m</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>低潮时间</CardTitle>
            <CardDescription>当日低潮预测</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lowTides.map((tide, index) => (
                <div key={index} className="flex justify-between items-center p-2 border-b last:border-0">
                  <span className="text-lg font-medium">{tide.time}</span>
                  <span className="text-lg">{tide.height.toFixed(2)}m</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>活动建议</CardTitle>
          <CardDescription>基于当日潮汐情况</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium">冲浪</h3>
              <p className="text-sm text-muted-foreground">
                {highTides.some(t => t.height > 1.5) 
                  ? "今天的高潮较高，可能提供不错的冲浪条件。建议在高潮前1-2小时尝试。" 
                  : "今天的潮汐变化较平缓，冲浪条件可能一般。"}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">钓鱼</h3>
              <p className="text-sm text-muted-foreground">
                {lowTides.length > 0 
                  ? `低潮时间（${lowTides[0].time}和${lowTides[1]?.time || ""}）适合岸钓。高潮期间适合船钓。` 
                  : "今天潮汐数据异常，请查看详细图表确定最佳钓鱼时间。"}
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">海滩摄影</h3>
              <p className="text-sm text-muted-foreground">
                {lowTides.some(t => t.height < 0.3) 
                  ? "今天低潮较明显，是拍摄潮间带和反光沙滩的好时机。" 
                  : "今天的潮汐变化不太明显，可能适合拍摄海浪和日落。"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center mt-6">
        <Button asChild variant="outline">
          <Link to={`/moon/${date}`}>
            查看月相详情
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default TideDetails;
