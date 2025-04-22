
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { format, addDays, subDays, isValid, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MoonPhaseDisplay } from "@/components/MoonPhaseDisplay";
import { calculateMoonPhase, getMoonRiseSet } from "@/utils/lunarPhaseCalculator";
import { useLocationStore } from "@/stores/locationStore";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

const MoonPhaseDetails = () => {
  const { date } = useParams<{ date: string }>();
  const { currentLocation } = useLocationStore();
  const [moonData, setMoonData] = useState<{
    phase: ReturnType<typeof calculateMoonPhase>;
    riseSet: { rise: string; set: string };
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (date && currentLocation) {
      try {
        // Parse and validate date
        const dateObj = parseISO(date);
        if (!isValid(dateObj)) {
          setError(`Invalid date format: ${date}`);
          return;
        }
        
        const phase = calculateMoonPhase(dateObj);
        const riseSet = getMoonRiseSet(dateObj, currentLocation.latitude, currentLocation.longitude);
        
        setMoonData({ phase, riseSet });
        setError(null);
      } catch (err) {
        console.error("Error loading moon data:", err);
        setError("Failed to load moon phase data. Please try a different date.");
      }
    }
  }, [date, currentLocation]);
  
  if (!date || !currentLocation) {
    return <div className="text-center py-8">请选择位置和日期</div>;
  }
  
  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }
  
  if (!moonData) {
    return <div className="text-center py-8">加载中...</div>;
  }
  
  // Parse date safely
  let dateObj: Date;
  try {
    dateObj = parseISO(date);
    if (!isValid(dateObj)) throw new Error("Invalid date");
  } catch (e) {
    return <div className="text-center py-8 text-red-500">日期格式无效</div>;
  }
  
  const formattedDate = format(dateObj, "yyyy年MM月dd日");
  const prevDate = format(subDays(dateObj, 1), "yyyy-MM-dd");
  const nextDate = format(addDays(dateObj, 1), "yyyy-MM-dd");
  
  const { phase, riseSet } = moonData;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link to={`/moon/${prevDate}`}>
            <ChevronLeftIcon className="mr-2 h-4 w-4" />
            前一天
          </Link>
        </Button>
        
        <h1 className="text-2xl font-bold">{formattedDate}</h1>
        
        <Button variant="outline" asChild>
          <Link to={`/moon/${nextDate}`}>
            后一天
            <ChevronRightIcon className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      
      <div className="flex flex-col items-center justify-center py-8">
        <MoonPhaseDisplay phase={phase} size="xl" showLabel />
        
        <div className="mt-8 text-center">
          <p className="text-lg">照明度: <span className="font-semibold">{Math.round(phase.illumination * 100)}%</span></p>
          <p className="text-muted-foreground">
            月相周期位置: {Math.round(phase.phase * 100)}%
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>月出月落时间</CardTitle>
            <CardDescription>基于当前位置: {currentLocation.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between">
              <div>
                <p className="text-sm font-medium">月出</p>
                <p className="text-2xl font-bold">{riseSet.rise}</p>
              </div>
              
              <div className="text-right">
                <p className="text-sm font-medium">月落</p>
                <p className="text-2xl font-bold">{riseSet.set}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>月相信息</CardTitle>
            <CardDescription>月相对摄影和户外活动的影响</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">可见性</h3>
                <p className="text-sm text-muted-foreground">
                  {phase.illumination > 0.7 
                    ? "月亮明亮，适合月光摄影和夜间活动。" 
                    : phase.illumination > 0.3 
                      ? "月亮有适中亮度，可能适合某些夜间活动。" 
                      : "月亮亮度较低，适合观星但不适合依靠月光照明。"}
                </p>
              </div>
              
              <div>
                <h3 className="font-medium">潮汐影响</h3>
                <p className="text-sm text-muted-foreground">
                  {phase.name === "新月" || phase.name === "满月" 
                    ? "新月或满月期间，潮汐差异达到最大（大潮）。" 
                    : phase.name === "上弦月" || phase.name === "下弦月" 
                      ? "上弦月或下弦月期间，潮汐差异最小（小潮）。" 
                      : "过渡期的潮汐变化相对平稳。"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-center mt-6">
        <Button asChild variant="outline">
          <Link to={`/tide/${date}`}>
            查看当日潮汐
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default MoonPhaseDetails;
