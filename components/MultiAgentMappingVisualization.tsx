import React, { useState } from 'react';
import { ArrowRight, Network, MessageSquare, TreePine, Zap, Clock, Database } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const ConceptMapping = ({ mapping, isActive, onClick }) => {
  const icons = {
    'Coordination Graphs': Network,
    'Max-Plus messages': MessageSquare,
    'MCTS roll-outs': TreePine,
    'Communication patterns': Zap,
    'Inter-LLM communication': Database,
    'Test-time reasoning/simulation': Clock
  };
  
  const AcademicIcon = icons[mapping.academic.title] || Network;
  const PracticalIcon = icons[mapping.practical.title] || Network;
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-md",
        isActive ? "ring-2 ring-blue-500 shadow-md" : ""
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Academic Concept */}
          <div className="flex items-start gap-3">
            <div className={cn(
              "p-2 rounded-lg shrink-0",
              isActive ? "bg-blue-100" : "bg-slate-100"
            )}>
              <AcademicIcon className={cn(
                "w-4 h-4",
                isActive ? "text-blue-600" : "text-slate-600"
              )} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-inter font-semibold text-sm text-slate-800 leading-tight">
                  {mapping.academic.title}
                </h3>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                  Theory
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {mapping.academic.description}
              </p>
            </div>
          </div>

          {/* Connection Indicator */}
          <div className="relative">
            <div className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 w-8 h-px transition-colors duration-300 hidden lg:block",
              isActive ? "bg-blue-500" : "bg-slate-300"
            )} />
            <ArrowRight className={cn(
              "absolute left-6 top-1/2 -translate-y-1/2 w-3 h-3 transition-colors duration-300 hidden lg:block",
              isActive ? "text-blue-500" : "text-slate-400"
            )} />
            
            {/* Practical Concept */}
            <div className="flex items-start gap-3 lg:pl-12">
              <div className={cn(
                "p-2 rounded-lg shrink-0",
                isActive ? "bg-blue-100" : "bg-slate-100"
              )}>
                <PracticalIcon className={cn(
                  "w-4 h-4",
                  isActive ? "text-blue-600" : "text-slate-600"
                )} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-inter font-semibold text-sm text-slate-800 leading-tight">
                    {mapping.practical.title}
                  </h3>
                  <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                    Practice
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {mapping.practical.description}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Insight Panel */}
        {isActive && (
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex items-start gap-2">
              <div className="p-1.5 rounded-md bg-blue-100 shrink-0">
                <Network className="w-3 h-3 text-blue-600" />
              </div>
              <div>
                <h4 className="font-inter font-medium text-xs text-blue-800 mb-1">
                  Why This Connection Matters
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {mapping.insight}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default function MultiAgentMappingVisualization() {
  const [activeMapping, setActiveMapping] = useState(null);

  const mappings = [
    {
      id: 'cg',
      academic: {
        title: 'Coordination Graphs',
        description: 'A CG is an effective way of encoding who should talk to whom now, or more broadly, which agents on the team should be interacting with each other.'
      },
      practical: {
        title: 'Communication patterns',
        description: 'Structured patterns that determine how different LLMs in a system coordinate and share information during task execution.'
      },
      insight: 'Explicitly representing the topology of agent interactions, and varying it based on context, helps optimize the cost/benefit tradeoff of communication and coordination.'
    },
    {
      id: 'mp',
      academic: {
        title: 'Max-Plus messages',
        description: 'Mathematical messages that encode utility and preference information between agents in a distributed optimization problem.'
      },
      practical: {
        title: 'Inter-LLM communication',
        description: 'Short, human- or machine-readable snippets of information, e.g., natural language summaries, structured output, numbers etc.'
      },
      insight: 'Local messages are tiny, can be streamed, cached, or routed through cheap models. Because they are iterative, the orchestrator can stop after k rounds and still have a coherent global plan.'
    },
    {
      id: 'mcts',
      academic: {
        title: 'MCTS roll-outs',
        description: 'Monte Carlo Tree Search trajectories that explore possible future states and actions to guide decision-making.'
      },
      practical: {
        title: 'Test-time reasoning/simulation',
        description: 'Each trajectory is a "what-if" execution trace that interleaves reasoning traces of individual agents with multi-agent coordination turns.'
      },
      insight: 'Rather than wait for reasoning to conclude before assigning sub-tasks, the planner can look ahead in deciding how to break down the problem. This makes long-horizon workflows (research pipelines, code-gen + unit tests, multi-step data cleaning) tractable and interruptible.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="space-y-3">
        {mappings.map((mapping) => (
          <ConceptMapping
            key={mapping.id}
            mapping={mapping}
            isActive={activeMapping === mapping.id}
            onClick={() => setActiveMapping(activeMapping === mapping.id ? null : mapping.id)}
          />
        ))}
      </div>

    </div>
  );
}