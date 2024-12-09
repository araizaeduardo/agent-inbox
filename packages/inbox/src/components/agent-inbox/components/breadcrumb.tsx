"use client";

import NextLink from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { useQueryParams } from "../hooks/use-query-params";
import {
  AGENT_INBOX_PARAM,
  INBOX_PARAM,
  VIEW_STATE_THREAD_QUERY_PARAM,
} from "../constants";
import { HumanInterrupt, ThreadStatusWithAll } from "../types";
import { prettifyText } from "../utils";
import { useThreadsContext } from "../contexts/ThreadContext";
import React from "react";

export function BreadCrumb({ className }: { className?: string }) {
  const { searchParams } = useQueryParams();
  const { threadData } = useThreadsContext();
  const [agentInboxLabel, setAgentInboxLabel] = React.useState<string>();
  const [selectedInboxLabel, setSelectedInboxLabel] = React.useState<string>();
  const [selectedThreadActionLabel, setSelectedThreadActionLabel] =
    React.useState<string>();

  React.useEffect(() => {
    const agentInboxParam = searchParams.get(AGENT_INBOX_PARAM);
    if (agentInboxParam) {
      setAgentInboxLabel(prettifyText(agentInboxParam));
    } else {
      setAgentInboxLabel(undefined);
    }

    const selectedInboxParam = searchParams.get(INBOX_PARAM) as
      | ThreadStatusWithAll
      | undefined;
    if (selectedInboxParam) {
      setSelectedInboxLabel(prettifyText(selectedInboxParam));
    } else {
      setSelectedInboxLabel(undefined);
    }

    const selectedThreadIdParam = searchParams.get(
      VIEW_STATE_THREAD_QUERY_PARAM
    );
    const selectedThread = threadData.find(
      (t) => t.thread.thread_id === selectedThreadIdParam
    );
    const selectedThreadAction = (
      selectedThread?.interrupts as HumanInterrupt[] | undefined
    )?.[0]?.action_request?.action;
    if (selectedThreadAction) {
      setSelectedThreadActionLabel(prettifyText(selectedThreadAction));
    } else {
      setSelectedThreadActionLabel(undefined);
    }
  }, [searchParams]);

  if (!agentInboxLabel) {
    return null;
  }

  const constructInboxLink = (inbox: ThreadStatusWithAll) => {
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete(VIEW_STATE_THREAD_QUERY_PARAM);
    return `${currentUrl.pathname}${currentUrl.search}`;
  };

  return (
    <div
      className={cn(
        "flex items-center justify-start gap-2 text-gray-500 text-sm",
        className
      )}
    >
      <NextLink href="/">
        <Button size="sm" className="text-gray-500" variant="link">
          {agentInboxLabel}
        </Button>
      </NextLink>

      {selectedInboxLabel && (
        <>
          <ChevronRight className="h-[14px] w-[14px]" />
          <NextLink
            href={constructInboxLink(selectedInboxLabel as ThreadStatusWithAll)}
          >
            <Button size="sm" className="text-gray-500" variant="link">
              {selectedInboxLabel}
            </Button>
          </NextLink>
        </>
      )}
      {selectedThreadActionLabel && (
        <>
          <ChevronRight className="h-[14px] w-[14px]" />
          <NextLink href={window.location.pathname + window.location.search}>
            <Button size="sm" className="text-gray-500" variant="link">
              {selectedThreadActionLabel}
            </Button>
          </NextLink>
        </>
      )}
    </div>
  );
}
