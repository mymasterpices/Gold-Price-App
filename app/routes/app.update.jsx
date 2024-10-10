import React, { useState, useEffect } from "react";
import { TextField, Page, Card, Button, FormLayout, ButtonGroup } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { json } from "@remix-run/node";

// Import Prisma db
import db from "../db.server";

export async function loader() {
    // Get data from database
    let rkGRates = await db.goldGSTRates.findFirst();

    // If there's no data, return null
    if (!rkGRates) {
        return null;
    }

    // Log the data and return it as JSON
    console.log("Data loaded from database -->", rkGRates);
    return json(rkGRates);
}

export async function action({ request }) {
    // Handle form submission logic here
    let data = await request.formData();
    data = Object.fromEntries(data);

    await db.goldGSTRates.upsert({
        where: { id: 1 },
        update: {
            id: 1,
            gold_rate_22K: data.gold_rate_22K,
            gstRate: data.gstRate
        },
        create: {
            id: 1,
            gold_rate_22K: data.gold_rate_22K,
            gstRate: data.gstRate
        },
    });

    console.log("New Data save successfully!!");
    return json(data);
}

export default function Update() {
    const navigate = useNavigate();
    const getGoldRate = useLoaderData();
    const [formState, setFormState] = useState(getGoldRate);

    const [showToast, setShowToast] = useState(getGoldRate);

    useEffect(() => {
        setShowToast('New gold rate has been set');
    });

    return (
        <Page>
            <Card>
                <TitleBar title="Material Rate" />
                <Form method="POST">
                    <FormLayout.Group>
                        <TextField
                            label="Enter Gold Rate"
                            name="gold_rate_22K"
                            value={formState?.gold_rate_22K}
                            onChange={(value) =>
                                setFormState({
                                    ...formState,
                                    gold_rate_22K: value,
                                })
                            }
                            helpText="22K gold rate of 1/g"
                        />
                        <TextField
                            label="GST Rate"
                            name="gstRate"
                            value={formState?.gstRate}
                            onChange={(value) =>
                                setFormState({
                                    ...formState,
                                    gstRate: value,
                                })
                            }
                            helpText="Gst rate only (No % symbol required)"
                        />
                    </FormLayout.Group>
                    <br />
                    <ButtonGroup>
                        <Button variant="primary" submit={true} onClick={() => shopify.toast.show(showToast)}>
                            Save
                        </Button>
                        <Button onClick={() => navigate("../apply")}> Apply new rates</Button>
                    </ButtonGroup>
                </Form>
            </Card>
        </Page>
    );
}
