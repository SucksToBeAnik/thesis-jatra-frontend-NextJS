import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { trendingPapers } from "@/utils/fakeData";

export default function LandingRight() {
  return (
    <div className="flex flex-col items-start justify-start">
      <h2 className="text-2xl font-title font-bold mb-8 text-gray-700 dark:text-muted-foreground">
        Trending Papers
      </h2>
      <div className="flex flex-col gap-4 w-3/4 h-[500px] overflow-y-scroll scrollbar rounded-md">
        {trendingPapers.map((paper) => (
          <Card key={paper.id} className="rounded-md shadow-md border-none">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  {paper.title}
                  <Badge variant="default">{paper.citationCount}</Badge>
                </div>
              </CardTitle>
              <CardDescription>
                <p className="text-xs italic text-gray-500">
                  {paper.publishedDate}
                </p>
              </CardDescription>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-gray-500">{paper.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Read More</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
