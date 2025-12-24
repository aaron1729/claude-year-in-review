import { getProcessedData } from '@/lib/data';
import { ScrollProgress } from '@/components/ui/ScrollProgress';
import { Opening } from '@/components/sections/Opening';
import { TemporalOverview } from '@/components/sections/TemporalOverview';
import { ThematicDiversity } from '@/components/sections/ThematicDiversity';
import { ToolEvolution } from '@/components/sections/ToolEvolution';
import { IntellectualPartnership } from '@/components/sections/IntellectualPartnership';
import { CreativeInterludes } from '@/components/sections/CreativeInterludes';
import { RhythmPatterns } from '@/components/sections/RhythmPatterns';
import { HighlightReel } from '@/components/sections/HighlightReel';
import { WhatILearned } from '@/components/sections/WhatILearned';
import { Closing } from '@/components/sections/Closing';

export default function Home() {
  const data = getProcessedData();

  return (
    <>
      <ScrollProgress />
      <main>
        <Opening data={data} />
        <TemporalOverview data={data} />
        <ThematicDiversity data={data} />
        <ToolEvolution data={data} />
        <IntellectualPartnership data={data} />
        <CreativeInterludes data={data} />
        <RhythmPatterns data={data} />
        <HighlightReel data={data} />
        <WhatILearned data={data} />
        <Closing data={data} />
      </main>
    </>
  );
}
