import React, { useMemo } from "react";
import { useCustom } from "@refinedev/core";
import { Card, Typography } from "antd";
import { Area, AreaConfig } from "@ant-design/plots";
import { DollarOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

type YearlyDealGroupedResponse = {
    yearlyDealGrouped: {
        nodes: {
            title: string;
            dealsAggregate: {
                groupBy: {
                    closeDateMonth: number;
                    closeDateYear: number;
                };
                sum: {
                    value: number;
                };
            }[];
        }[];
    };
};

export const DealChart: React.FC = () => {
    const { data } = useCustom<YearlyDealGroupedResponse>({
        method: "post",
        url: "/graphql",
        meta: {
            rawQuery: `query {
                yearlyDealGrouped: dealStages(filter: { title: { in: ["WON", "LOST"] } }) {
                    nodes {
                      title
                      dealsAggregate {
                        groupBy {
                          closeDateMonth
                          closeDateYear
                        }
                        sum {
                          value
                        }
                      }
                    }
                  }
              }
            `,
        },
    });

    const dealData = useMemo(() => {
        const won = data?.data.yearlyDealGrouped.nodes
            .find((node) => node.title === "WON")
            ?.dealsAggregate.map((item) => {
                const { closeDateMonth, closeDateYear } = item.groupBy;
                const date = dayjs(`${closeDateYear}-${closeDateMonth}-01`);
                return {
                    timeUnix: date.unix(),
                    timeText: date.format("MMM YYYY"),
                    value: item.sum.value,
                    state: "Won",
                };
            });

        const lost = data?.data.yearlyDealGrouped.nodes
            .find((node) => node.title === "LOST")
            ?.dealsAggregate.map((item) => {
                const { closeDateMonth, closeDateYear } = item.groupBy;
                const date = dayjs(`${closeDateYear}-${closeDateMonth}-01`);
                return {
                    timeUnix: date.unix(),
                    timeText: date.format("MMM YYYY"),
                    value: item.sum.value,
                    state: "Lost",
                };
            });

        return [...(won || []), ...(lost || [])].sort(
            (a, b) => a.timeUnix - b.timeUnix,
        );
    }, [data]);

    const config: AreaConfig = {
        stack: false,
        data: dealData,
        xField: "timeText",
        yField: "value",
        seriesField: "state",
        legend: { offsetY: -6 },
        tooltip: {
            formatter: (data: any) => ({
                name: data.state,
                value: `$${Number(data.value) / 1000}k`,
            }),
        },
    };

    return (
        <Card
            style={{ height: "432px" }}
            headStyle={{ padding: "8px 16px" }}
            bodyStyle={{ padding: "24px 24px 0px 24px" }}
            title={
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}
                >
                    <DollarOutlined />
                    <Typography.Text style={{ marginLeft: ".5rem" }}>
                        Deals
                    </Typography.Text>
                </div>
            }
        >
            <Area {...config} height={325} />
        </Card>
    );
};