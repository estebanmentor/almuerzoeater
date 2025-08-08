
'use server';

import { db } from '@/lib/firebase-admin';
import type { AdminSection, DashboardMetricCard, DataExtractionJob, ExampleQuery } from '@/models/admin';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Simulate a database query delay
const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export async function getAdminSections(): Promise<AdminSection[]> {
    await delay(50);
    const sectionsCol = await db.collection('adminSections').get();
    const sectionsList = sectionsCol.docs.map(doc => doc.data() as AdminSection);
    return sectionsList;
}

export async function getAdminDashboardMetrics(): Promise<{
    users: DashboardMetricCard[],
    restaurants: DashboardMetricCard[],
    financials: DashboardMetricCard[],
    platform: DashboardMetricCard[],
}> {
    await delay(50);
    const metricsDoc = await db.collection('admin').doc('dashboardMetrics').get();
    if (metricsDoc.exists) {
        return metricsDoc.data() as {
            users: DashboardMetricCard[],
            restaurants: DashboardMetricCard[],
            financials: DashboardMetricCard[],
            platform: DashboardMetricCard[],
        };
    }
    // Return a default empty structure if the document doesn't exist
    return { users: [], restaurants: [], financials: [], platform: [] };
}

export async function getDataExtractionJobs(): Promise<DataExtractionJob[]> {
    await delay(50);
    const jobsCol = await db.collection('dataExtractionJobs').get();
    const jobsList = jobsCol.docs.map(doc => doc.data() as DataExtractionJob);
    return jobsList;
}

export async function getExampleQueries(): Promise<ExampleQuery[]> {
    await delay(50);
    const queriesCol = await db.collection('exampleQueries').get();
    const queriesList = queriesCol.docs.map(doc => doc.data() as ExampleQuery);
    return queriesList;
}
