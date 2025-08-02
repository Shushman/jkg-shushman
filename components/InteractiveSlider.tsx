import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

export default function InteractiveSlider() {
  const [value, setValue] = useState([50]);
  const [multiplier, setMultiplier] = useState([2]);

  const result = value[0] * multiplier[0];
  const normalizedValue = value[0] / 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Interactive Parameter Control</CardTitle>
        <CardDescription>
          Adjust the sliders below to see real-time calculations and visualize the mathematical relationship.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Input Value: {value[0]}
          </label>
          <Slider
            value={value}
            onValueChange={setValue}
            max={100}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Multiplier: {multiplier[0]}
          </label>
          <Slider
            value={multiplier}
            onValueChange={setMultiplier}
            min={0.1}
            max={5}
            step={0.1}
            className="w-full"
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{value[0]}</div>
              <p className="text-xs text-muted-foreground">Value</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">{multiplier[0]}</div>
              <p className="text-xs text-muted-foreground">Multiplier</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-primary">{result.toFixed(1)}</div>
              <p className="text-xs text-muted-foreground">Result</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-muted">
          <CardContent className="pt-6">
            <div className="space-y-2">
              <p className="text-sm">
                <strong>Interactive Formula:</strong> Result = Value × Multiplier
              </p>
              <p className="text-sm font-mono">
                {value[0]} × {multiplier[0]} = <span className="text-primary font-bold">{result.toFixed(1)}</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Normalized value: {normalizedValue.toFixed(2)} (scaled to 0-1 range)
              </p>
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}