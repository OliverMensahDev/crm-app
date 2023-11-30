import React from "react";
import { IResourceComponentsProps, BaseRecord } from "@refinedev/core";
import {
    useTable,
    List,
    EditButton,
    ShowButton,
    DeleteButton,
    UrlField,
    TextField,
} from "@refinedev/antd";
import { Table, Space, Avatar } from "antd";

export const ContactList: React.FC<IResourceComponentsProps> = () => {
    const { tableProps } = useTable({
        meta: {
            fields: [
                "id",
                "avatarUrl",
                "name",
                "businessType",
                "companySize",
                "country",
                "website",
                { salesOwner: ["id", "name"] },
            ],
        },
    });

    return (
        <List>
            <Table {...tableProps} rowKey="id">
                <Table.Column
                    title="Name"
                    render={(
                        _,
                        record: { name: string; avatarUrl: string },
                    ) => (
                        <Space>
                            <Avatar
                                src={record.avatarUrl}
                                size="large"
                                shape="square"
                                alt={record.name}
                            />
                            <TextField value={record.name} />
                        </Space>
                    )}
                />
                <Table.Column dataIndex="businessType" title="Business Type" />
                <Table.Column dataIndex="companySize" title="Company Size" />
                <Table.Column dataIndex="country" title="Country" />
                <Table.Column
                    dataIndex={["website"]}
                    title="Website"
                    render={(value: string) => <UrlField value={value} />}
                />
                <Table.Column
                    dataIndex={["salesOwner", "name"]}
                    title="Sales Owner"
                />
                <Table.Column
                    title="Actions"
                    dataIndex="actions"
                    render={(_, record: BaseRecord) => (
                        <Space>
                            <EditButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                            <ShowButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                            <DeleteButton
                                hideText
                                size="small"
                                recordItemId={record.id}
                            />
                        </Space>
                    )}
                />
            </Table>
        </List>
    );
};