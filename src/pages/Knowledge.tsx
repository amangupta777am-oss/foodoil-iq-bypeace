import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, AlertTriangle, CheckCircle2, Info, Beaker, Scale, Shield } from "lucide-react";

const parameters = [
  {
    id: "ffa",
    name: "Free Fatty Acid (FFA)",
    shortName: "FFA",
    unit: "%",
    limit: 0.3,
    icon: Beaker,
    color: "text-primary",
    bgColor: "bg-primary/10",
    description: "Free Fatty Acids are formed when triglycerides in oil break down through hydrolysis. This occurs due to moisture, heat, and enzymes.",
    whyItMatters: [
      "High FFA indicates oil degradation and rancidity",
      "Affects taste, smell, and nutritional value",
      "Can cause digestive issues in consumers",
      "Accelerates further oxidation of the oil",
    ],
    causes: [
      "Prolonged exposure to moisture",
      "High frying temperatures",
      "Contamination with food particles",
      "Extended storage periods",
    ],
    interpretation: {
      good: "< 0.2%: Oil is fresh and suitable for use",
      borderline: "0.2-0.3%: Monitor closely, consider replacement soon",
      bad: "> 0.3%: Oil should be replaced immediately",
    },
  },
  {
    id: "tpc",
    name: "Total Polar Compounds (TPC)",
    shortName: "TPC",
    unit: "%",
    limit: 25,
    icon: Scale,
    color: "text-secondary",
    bgColor: "bg-secondary/10",
    description: "Total Polar Compounds are oxidation products that accumulate in frying oil over time. They include aldehydes, ketones, and other degradation products.",
    whyItMatters: [
      "Primary indicator of oil quality deterioration",
      "Legally regulated in many countries (EU, China, etc.)",
      "Direct correlation with health risks",
      "Affects food absorption and quality",
    ],
    causes: [
      "Repeated heating cycles",
      "High temperature frying",
      "Oxygen exposure during frying",
      "Food particle contamination",
    ],
    interpretation: {
      good: "< 18%: Excellent oil quality",
      borderline: "18-25%: Oil degrading, increase monitoring",
      bad: "> 25%: Exceeds legal limit in most jurisdictions",
    },
  },
  {
    id: "pv",
    name: "Peroxide Value (PV)",
    shortName: "PV",
    unit: "meq/kg",
    limit: 10,
    icon: AlertTriangle,
    color: "text-warning",
    bgColor: "bg-warning/10",
    description: "Peroxide Value measures primary oxidation products (hydroperoxides) formed when oil reacts with oxygen. It's an early indicator of oxidative rancidity.",
    whyItMatters: [
      "Early warning of oxidation",
      "Indicates freshness of oil",
      "Peroxides can be harmful to health",
      "High PV leads to off-flavors",
    ],
    causes: [
      "Exposure to air/oxygen",
      "Light exposure during storage",
      "Metal contamination (iron, copper)",
      "Storage at elevated temperatures",
    ],
    interpretation: {
      good: "< 7 meq/kg: Fresh oil with minimal oxidation",
      borderline: "7-10 meq/kg: Some oxidation, monitor frequently",
      bad: "> 10 meq/kg: Significant oxidation, replace oil",
    },
  },
];

const regulations = [
  {
    region: "European Union",
    standard: "Council Regulation (EC) No 1925/2006",
    tpcLimit: "25%",
    notes: "Legally binding limit for frying oils",
  },
  {
    region: "China",
    standard: "GB 2716-2018",
    tpcLimit: "27%",
    notes: "National food safety standard",
  },
  {
    region: "India (FSSAI)",
    standard: "FSSAI Regulations 2011",
    tpcLimit: "25%",
    notes: "Mandatory for commercial food establishments",
  },
  {
    region: "Codex Alimentarius",
    standard: "CODEX STAN 210-1999",
    tpcLimit: "25% (recommended)",
    notes: "International guideline",
  },
];

export default function Knowledge() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Knowledge Panel</h1>
          <p className="text-sm text-muted-foreground">
            Understanding oil quality parameters and food safety standards
          </p>
        </div>
      </div>

      {/* Intro Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <Info className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold mb-2">Why Oil Quality Matters</h3>
              <p className="text-sm text-muted-foreground">
                Frying oil degrades over time through oxidation, hydrolysis, and polymerization. 
                Monitoring key parameters ensures food safety, maintains taste quality, and complies 
                with regulatory requirements. Regular testing protects consumers and your business.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Parameters Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Beaker className="h-5 w-5" />
          Key Quality Parameters
        </h2>
        
        <div className="space-y-4">
          {parameters.map((param) => (
            <Card key={param.id} className="overflow-hidden">
              <CardHeader className={`${param.bgColor} border-b`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <param.icon className={`h-6 w-6 ${param.color}`} />
                    <div>
                      <CardTitle className="text-lg">{param.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Regulatory Limit: {param.limit} {param.unit}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="font-mono">
                    {param.shortName}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {param.description}
                </p>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="why">
                    <AccordionTrigger className="text-sm font-medium">
                      Why It Matters
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {param.whyItMatters.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="causes">
                    <AccordionTrigger className="text-sm font-medium">
                      Common Causes of Elevation
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2">
                        {param.causes.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <AlertTriangle className="h-4 w-4 text-warning flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="interpret">
                    <AccordionTrigger className="text-sm font-medium">
                      How to Interpret Results
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-success/10">
                          <div className="w-3 h-3 rounded-full bg-success" />
                          <span className="text-sm">{param.interpretation.good}</span>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-warning/10">
                          <div className="w-3 h-3 rounded-full bg-warning" />
                          <span className="text-sm">{param.interpretation.borderline}</span>
                        </div>
                        <div className="flex items-center gap-3 p-2 rounded-lg bg-destructive/10">
                          <div className="w-3 h-3 rounded-full bg-destructive" />
                          <span className="text-sm">{param.interpretation.bad}</span>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Regulatory Standards */}
      <div>
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Regulatory Standards by Region
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {regulations.map((reg, i) => (
            <Card key={i}>
              <CardContent className="pt-4">
                <h3 className="font-semibold text-primary">{reg.region}</h3>
                <p className="text-xs text-muted-foreground mt-1">{reg.standard}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm">TPC Limit:</span>
                  <Badge variant="secondary">{reg.tpcLimit}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{reg.notes}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-success" />
            Best Practices for Oil Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Daily Operations</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Filter oil at least once daily</li>
                <li>• Skim surface debris regularly</li>
                <li>• Maintain optimal frying temperature (160-180°C)</li>
                <li>• Cover fryers when not in use</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Testing & Monitoring</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Test oil quality at least twice daily during peak use</li>
                <li>• Record all test results for compliance</li>
                <li>• Replace oil when any parameter exceeds limits</li>
                <li>• Calibrate testing equipment regularly</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <p className="text-xs text-muted-foreground text-center italic">
        This information is provided for educational purposes. Always follow local regulations 
        and consult with food safety professionals for compliance requirements.
      </p>
    </div>
  );
}
