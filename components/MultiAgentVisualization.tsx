import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import * as d3 from 'd3';

interface Agent {
  id: string;
  type: 'base' | 'proposal' | 'orchestrator';
  x: number;
  y: number;
  score: number;
  instruction: string;
  active: boolean;
}

interface Connection {
  source: string;
  target: string;
  type: 'feedback' | 'instruction' | 'coordination';
  strength: number;
}

interface RoundData {
  round: number;
  agents: Agent[];
  connections: Connection[];
  bestScore: number;
  avgScore: number;
}

export default function MultiAgentVisualization() {
  const [numProposalAgents, setNumProposalAgents] = useState([4]);
  const [currentRound, setCurrentRound] = useState([0]);
  const [isRunning, setIsRunning] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [rounds, setRounds] = useState<RoundData[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const maxRounds = 10;

  // Generate simulated experiment data
  const generateRounds = (numAgents: number) => {
    const roundsData: RoundData[] = [];
    
    // Initial setup
    const baseAgent: Agent = {
      id: 'base',
      type: 'base',
      x: 400,
      y: 300,
      score: 0.3, // Starting performance
      instruction: 'Initial instruction',
      active: false
    };

    const orchestrator: Agent = {
      id: 'orchestrator',
      type: 'orchestrator',
      x: 400,
      y: 100,
      score: 0,
      instruction: 'Coordinates proposals',
      active: true
    };

    for (let round = 0; round <= maxRounds; round++) {
      const proposalAgents: Agent[] = [];
      
      // Create proposal agents in a circle around the base agent
      for (let i = 0; i < numAgents; i++) {
        const angle = (i / numAgents) * 2 * Math.PI;
        const radius = 150;
        proposalAgents.push({
          id: `proposal-${i}`,
          type: 'proposal',
          x: 400 + radius * Math.cos(angle),
          y: 300 + radius * Math.sin(angle),
          score: Math.max(0, 0.3 + (round * 0.05) + (Math.random() - 0.5) * 0.2),
          instruction: `Instruction variant ${i + 1}`,
          active: round > 0
        });
      }

      const allAgents = [baseAgent, orchestrator, ...proposalAgents];
      
      // Generate dynamic connections based on round
      const connections: Connection[] = [];
      
      // Orchestrator always connects to all proposal agents
      proposalAgents.forEach(agent => {
        connections.push({
          source: 'orchestrator',
          target: agent.id,
          type: 'coordination',
          strength: 0.8 + Math.random() * 0.2
        });
      });

      // Dynamic proposal agent connections (changes each round)
      if (round > 0) {
        for (let i = 0; i < numAgents; i++) {
          // Each agent connects to 1-2 neighbors based on orchestrator's decision
          const numConnections = Math.floor(Math.random() * 2) + 1;
          for (let j = 0; j < numConnections; j++) {
            const targetIdx = (i + j + 1) % numAgents;
            if (targetIdx !== i) {
              connections.push({
                source: `proposal-${i}`,
                target: `proposal-${targetIdx}`,
                type: 'instruction',
                strength: Math.random() * 0.6 + 0.2
              });
            }
          }
        }
      }

      // Base agent receives instructions from best performing proposals
      const bestAgents = proposalAgents
        .sort((a, b) => b.score - a.score)
        .slice(0, Math.min(2, numAgents));
        
      bestAgents.forEach(agent => {
        connections.push({
          source: agent.id,
          target: 'base',
          type: 'feedback',
          strength: agent.score
        });
      });

      const scores = proposalAgents.map(a => a.score).filter(s => s > 0);
      const avgScore = scores.length > 0 ? scores.reduce((a, b) => a + b) / scores.length : 0;
      const bestScore = scores.length > 0 ? Math.max(...scores) : 0;

      roundsData.push({
        round,
        agents: allAgents,
        connections,
        bestScore,
        avgScore
      });
    }
    
    return roundsData;
  };

  // Initialize data when number of agents changes
  useEffect(() => {
    const newRounds = generateRounds(numProposalAgents[0]);
    setRounds(newRounds);
    setCurrentRound([0]);
  }, [numProposalAgents]);

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && currentRound[0] < maxRounds) {
      intervalRef.current = setInterval(() => {
        setCurrentRound(prev => {
          const newRound = prev[0] + 1;
          if (newRound >= maxRounds) {
            setAutoPlay(false);
          }
          return [Math.min(newRound, maxRounds)];
        });
      }, 1500);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoPlay, currentRound]);

  // D3 visualization
  useEffect(() => {
    if (!svgRef.current || rounds.length === 0) return;

    const currentData = rounds[currentRound[0]];
    if (!currentData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 800;
    const height = 600;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Add gradient definitions for connections
    const defs = svg.append("defs");
    
    // Create gradients for different connection types
    const gradients = [
      { id: "coordination-gradient", colors: ["#3b82f6", "#60a5fa"] },
      { id: "instruction-gradient", colors: ["#10b981", "#34d399"] },
      { id: "feedback-gradient", colors: ["#f59e0b", "#fbbf24"] }
    ];

    gradients.forEach(grad => {
      const gradient = defs.append("linearGradient")
        .attr("id", grad.id)
        .attr("gradientUnits", "userSpaceOnUse");
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", grad.colors[0])
        .attr("stop-opacity", 0.8);
        
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", grad.colors[1])
        .attr("stop-opacity", 0.4);
    });

    // Add glow filter
    const filter = defs.append("filter")
      .attr("id", "glow");
    
    filter.append("feGaussianBlur")
      .attr("stdDeviation", "3")
      .attr("result", "coloredBlur");
    
    const feMerge = filter.append("feMerge");
    feMerge.append("feMergeNode").attr("in", "coloredBlur");
    feMerge.append("feMergeNode").attr("in", "SourceGraphic");

    // Create connections with improved styling
    const connections = g.selectAll(".connection")
      .data(currentData.connections)
      .enter()
      .append("line")
      .attr("class", "connection")
      .attr("x1", d => {
        const source = currentData.agents.find(a => a.id === d.source);
        return source ? source.x : 0;
      })
      .attr("y1", d => {
        const source = currentData.agents.find(a => a.id === d.source);
        return source ? source.y : 0;
      })
      .attr("x2", d => {
        const target = currentData.agents.find(a => a.id === d.target);
        return target ? target.x : 0;
      })
      .attr("y2", d => {
        const target = currentData.agents.find(a => a.id === d.target);
        return target ? target.y : 0;
      })
      .attr("stroke", d => {
        switch (d.type) {
          case 'coordination': return 'url(#coordination-gradient)';
          case 'instruction': return 'url(#instruction-gradient)';
          case 'feedback': return 'url(#feedback-gradient)';
          default: return '#6b7280';
        }
      })
      .attr("stroke-width", d => Math.max(2, d.strength * 5))
      .attr("opacity", d => 0.6 + d.strength * 0.4)
      .attr("stroke-dasharray", d => d.type === 'coordination' ? "8,4" : "none")
      .attr("stroke-linecap", "round");

    // Create agents
    const agents = g.selectAll(".agent")
      .data(currentData.agents)
      .enter()
      .append("g")
      .attr("class", "agent")
      .attr("transform", d => `translate(${d.x},${d.y})`);

    // Agent circles with improved styling
    agents.append("circle")
      .attr("r", d => d.type === 'orchestrator' ? 28 : d.type === 'base' ? 32 : 22)
      .attr("fill", d => {
        if (!d.active) return '#f3f4f6';
        switch (d.type) {
          case 'base': return 'url(#base-gradient)';
          case 'orchestrator': return 'url(#orchestrator-gradient)';
          case 'proposal': return d3.interpolatePlasma(d.score * 0.8 + 0.2);
          default: return '#6b7280';
        }
      })
      .attr("stroke", d => {
        if (!d.active) return '#d1d5db';
        switch (d.type) {
          case 'base': return '#dc2626';
          case 'orchestrator': return '#7c3aed';
          case 'proposal': return d.score > 0.6 ? '#ffffff' : '#374151';
          default: return '#6b7280';
        }
      })
      .attr("stroke-width", d => d.active ? 3 : 2)
      .attr("opacity", d => d.active ? 1 : 0.6)
      .attr("filter", d => d.active ? "url(#glow)" : "none");

    // Add gradient definitions for agents
    const agentGradients = [
      { id: "base-gradient", colors: ["#f87171", "#ef4444"] },
      { id: "orchestrator-gradient", colors: ["#a78bfa", "#8b5cf6"] }
    ];

    agentGradients.forEach(grad => {
      const gradient = defs.append("radialGradient")
        .attr("id", grad.id);
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", grad.colors[0]);
        
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", grad.colors[1]);
    });

    // Agent labels with better typography
    agents.append("text")
      .attr("dy", "0.35em")
      .attr("text-anchor", "middle")
      .attr("fill", d => {
        if (!d.active) return '#9ca3af';
        if (d.type === 'proposal' && d.score > 0.6) return 'white';
        return d.type === 'orchestrator' ? 'white' : d.type === 'base' ? 'white' : '#1f2937';
      })
      .attr("font-size", d => d.type === 'orchestrator' ? "16px" : "12px")
      .attr("font-weight", "600")
      .attr("font-family", "Inter, system-ui, sans-serif")
      .text(d => {
        if (d.type === 'base') return 'Base';
        if (d.type === 'orchestrator') return 'Ω';
        return `P${d.id.split('-')[1]}`;
      });

    // Score labels for proposal agents with better styling
    agents.filter(d => d.type === 'proposal' && d.active)
      .append("text")
      .attr("dy", "3em")
      .attr("text-anchor", "middle")
      .attr("fill", "#1f2937")
      .attr("font-size", "10px")
      .attr("font-weight", "500")
      .attr("font-family", "JetBrains Mono, monospace")
      .text(d => d.score.toFixed(3));

    // Modern legend with better styling
    const legend = svg.append("g")
      .attr("transform", "translate(30, 30)");

    // Legend background
    legend.append("rect")
      .attr("x", -10)
      .attr("y", -10)
      .attr("width", 200)
      .attr("height", 80)
      .attr("fill", "rgba(255, 255, 255, 0.95)")
      .attr("stroke", "#e5e7eb")
      .attr("stroke-width", 1)
      .attr("rx", 8);

    const legendData = [
      { color: '#ef4444', label: 'Base LLM', sublabel: 'GPT-3.5' },
      { color: '#8b5cf6', label: 'Orchestrator', sublabel: 'GPT-4o' },
      { color: '#a855f7', label: 'Proposal Agent', sublabel: 'GPT-4o-mini' }
    ];

    const legendItems = legend.selectAll('.legend-item')
      .data(legendData)
      .enter()
      .append('g')
      .attr('class', 'legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 22})`);

    legendItems.append('circle')
      .attr('r', 7)
      .attr('fill', d => d.color)
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    legendItems.append('text')
      .attr('x', 18)
      .attr('dy', '-0.1em')
      .attr('font-size', '13px')
      .attr('font-weight', '600')
      .attr('font-family', 'Inter, system-ui, sans-serif')
      .attr('fill', '#1f2937')
      .text(d => d.label);

    legendItems.append('text')
      .attr('x', 18)
      .attr('dy', '1.1em')
      .attr('font-size', '10px')
      .attr('font-family', 'Inter, system-ui, sans-serif')
      .attr('fill', '#6b7280')
      .text(d => d.sublabel);

    // Connection type legend with modern styling
    const connLegend = svg.append("g")
      .attr("transform", "translate(260, 30)");

    // Connection legend background
    connLegend.append("rect")
      .attr("x", -10)
      .attr("y", -10)
      .attr("width", 180)
      .attr("height", 80)
      .attr("fill", "rgba(255, 255, 255, 0.95)")
      .attr("stroke", "#e5e7eb")
      .attr("stroke-width", 1)
      .attr("rx", 8);

    const connLegendData = [
      { color: '#3b82f6', label: 'Coordination', dash: true },
      { color: '#10b981', label: 'Instruction Exchange', dash: false },
      { color: '#f59e0b', label: 'Feedback', dash: false }
    ];

    const connLegendItems = connLegend.selectAll('.conn-legend-item')
      .data(connLegendData)
      .enter()
      .append('g')
      .attr('class', 'conn-legend-item')
      .attr('transform', (d, i) => `translate(0, ${i * 22})`);

    connLegendItems.append('line')
      .attr('x1', 0)
      .attr('x2', 25)
      .attr('y1', 0)
      .attr('y2', 0)
      .attr('stroke', d => d.color)
      .attr('stroke-width', 4)
      .attr('stroke-linecap', 'round')
      .attr('stroke-dasharray', d => d.dash ? "8,4" : "none");

    connLegendItems.append('text')
      .attr('x', 32)
      .attr('dy', '0.35em')
      .attr('font-size', '13px')
      .attr('font-weight', '500')
      .attr('font-family', 'Inter, system-ui, sans-serif')
      .attr('fill', '#1f2937')
      .text(d => d.label);

  }, [rounds, currentRound]);

  const currentData = rounds[currentRound[0]];

  return (
    <Card className="w-full border-0 shadow-lg bg-gradient-to-br from-white to-slate-50">
      <CardHeader className="pb-6">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Multi-Agent Instruction Tuning Visualization
        </CardTitle>
        <CardDescription className="text-base text-slate-600 leading-relaxed">
          Interactive visualization of dynamic coordination graphs in multi-agent prompt optimization
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Controls */}
        <div className="bg-slate-50 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 mb-4">Simulation Controls</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Proposal Agents: {numProposalAgents[0]}
              </label>
              <Slider
                value={numProposalAgents}
                onValueChange={setNumProposalAgents}
                min={2}
                max={8}
                step={1}
                disabled={autoPlay}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>2</span>
                <span>8</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                Round: {currentRound[0]} / {maxRounds}
              </label>
              <Slider
                value={currentRound}
                onValueChange={setCurrentRound}
                min={0}
                max={maxRounds}
                step={1}
                disabled={autoPlay}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-slate-500">
                <span>0</span>
                <span>{maxRounds}</span>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Button
                onClick={() => setAutoPlay(!autoPlay)}
                variant={autoPlay ? "destructive" : "default"}
                className={`h-11 font-semibold ${
                  autoPlay 
                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                }`}
              >
                {autoPlay ? '⏹ Stop' : '▶ Auto Play'}
              </Button>
              <Button
                onClick={() => setCurrentRound([0])}
                variant="outline"
                disabled={autoPlay}
                className="h-11 font-semibold border-slate-300 hover:bg-slate-100"
              >
                ↻ Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        {currentData && (
          <div className="grid grid-cols-3 gap-4">
            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <span className="text-white text-sm font-bold">R</span>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-blue-700">
                      {currentData.round}
                    </div>
                    <p className="text-sm text-blue-600 font-medium">Current Round</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <span className="text-white text-sm font-bold">🏆</span>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-700">
                      {currentData.bestScore.toFixed(3)}
                    </div>
                    <p className="text-sm text-green-600 font-medium">Best Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <span className="text-white text-sm font-bold">μ</span>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-purple-700">
                      {currentData.avgScore.toFixed(3)}
                    </div>
                    <p className="text-sm text-purple-600 font-medium">Average Score</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Visualization */}
        <div className="w-full flex justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border shadow-inner p-6">
          <svg
            ref={svgRef}
            width={800}
            height={600}
            className="w-full h-auto max-w-4xl drop-shadow-sm"
          />
        </div>

        {/* Algorithm Description */}
        <Card className="bg-muted">
          <CardContent className="pt-4">
            <div className="space-y-2 text-sm">
              <p><strong>Round {currentRound[0]} Status:</strong></p>
              {currentRound[0] === 0 ? (
                <p>Initial setup - agents are positioned but not yet active.</p>
              ) : (
                <>
                  <p>• Orchestrator (Ω) dynamically updates coordination graph</p>
                  <p>• Proposal agents exchange instructions based on graph topology</p>
                  <p>• Evaluator scores instructions on validation minibatch</p>
                  <p>• Best instructions provide feedback to base LLM</p>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}