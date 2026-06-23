'use client';

import { useState, useEffect, useMemo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { toast } from 'sonner';
import {
  FileText,
  Upload,
  Eye,
  Download,
  Trash2,
  FolderOpen,
  FileCheck,
  FileBadge,
  FileSpreadsheet,
  FileSignature,
  Award,
  Plus,
  Loader2,
} from 'lucide-react';

import { PageHeader } from '@/components/shared/page-header';
import { StatusBadge } from '@/components/shared/status-badge';
import { DataTable } from '@/components/data-table/data-table';
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogBody,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormFieldWrapper } from '@/components/shared/form-field-wrapper';
import { cn } from '@/lib/utils';

// --- Mock Data ---

interface DocumentItem {
  id: string;
  name: string;
  category: string;
  employee: string;
  uploadDate: string;
  fileSize: string;
  status: string;
}

const documents: DocumentItem[] = [
  { id: 'doc-1', name: 'Alice_Johnson_Offer_Letter.pdf', category: 'Offer Letter', employee: 'Alice Johnson', uploadDate: 'Jun 12, 2026', fileSize: '245 KB', status: 'verified' },
  { id: 'doc-2', name: 'Bob_Martinez_Employment_Contract.pdf', category: 'Contract', employee: 'Bob Martinez', uploadDate: 'Jun 10, 2026', fileSize: '512 KB', status: 'verified' },
  { id: 'doc-3', name: 'Carol_Williams_Passport.pdf', category: 'ID Proof', employee: 'Carol Williams', uploadDate: 'Jun 8, 2026', fileSize: '1.2 MB', status: 'pending' },
  { id: 'doc-4', name: 'David_Chen_W4_2026.pdf', category: 'Tax Form', employee: 'David Chen', uploadDate: 'Jun 6, 2026', fileSize: '180 KB', status: 'verified' },
  { id: 'doc-5', name: 'Emily_Davis_Policy_Ack.pdf', category: 'Policy Acknowledgment', employee: 'Emily Davis', uploadDate: 'Jun 4, 2026', fileSize: '95 KB', status: 'verified' },
  { id: 'doc-6', name: 'Frank_Wilson_AWS_Cert.pdf', category: 'Certificate', employee: 'Frank Wilson', uploadDate: 'Jun 2, 2026', fileSize: '320 KB', status: 'expired' },
  { id: 'doc-7', name: 'Grace_Lee_Offer_Letter.pdf', category: 'Offer Letter', employee: 'Grace Lee', uploadDate: 'May 28, 2026', fileSize: '238 KB', status: 'verified' },
  { id: 'doc-8', name: 'Henry_Brown_NDA.pdf', category: 'Contract', employee: 'Henry Brown', uploadDate: 'May 25, 2026', fileSize: '410 KB', status: 'verified' },
  { id: 'doc-9', name: 'Irene_Taylor_Drivers_License.pdf', category: 'ID Proof', employee: 'Irene Taylor', uploadDate: 'May 22, 2026', fileSize: '890 KB', status: 'pending' },
  { id: 'doc-10', name: 'James_Anderson_Tax_Return.pdf', category: 'Tax Form', employee: 'James Anderson', uploadDate: 'May 20, 2026', fileSize: '275 KB', status: 'verified' },
  { id: 'doc-11', name: 'Sarah_Parker_Policy_Ack.pdf', category: 'Policy Acknowledgment', employee: 'Sarah Parker', uploadDate: 'May 18, 2026', fileSize: '102 KB', status: 'verified' },
  { id: 'doc-12', name: 'Tom_Nguyen_PMP_Cert.pdf', category: 'Certificate', employee: 'Tom Nguyen', uploadDate: 'May 15, 2026', fileSize: '450 KB', status: 'verified' },
];

interface CategoryInfo {
  id: string;
  name: string;
  count: number;
  description: string;
  icon: typeof FileText;
}

const categories: CategoryInfo[] = [
  { id: 'cat-1', name: 'Offer Letter', count: 2, description: 'Official employment offer letters and acceptance documents.', icon: FileText },
  { id: 'cat-2', name: 'Contract', count: 2, description: 'Employment contracts, NDAs, and non-compete agreements.', icon: FileSignature },
  { id: 'cat-3', name: 'ID Proof', count: 2, description: 'Government-issued identification documents for verification.', icon: FileBadge },
  { id: 'cat-4', name: 'Tax Form', count: 2, description: 'W-4, W-2, and other tax-related documents and filings.', icon: FileSpreadsheet },
  { id: 'cat-5', name: 'Policy Acknowledgment', count: 2, description: 'Signed acknowledgments of company policies and handbooks.', icon: FileCheck },
  { id: 'cat-6', name: 'Certificate', count: 2, description: 'Professional certifications, training completions, and awards.', icon: Award },
];

interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  lastUpdated: string;
}

const templates: DocumentTemplate[] = [
  { id: 'tpl-1', name: 'Offer Letter Template', description: 'Standard employment offer letter with compensation details, start date, and terms of employment.', lastUpdated: 'Jun 1, 2026' },
  { id: 'tpl-2', name: 'Non-Disclosure Agreement', description: 'Mutual NDA template covering confidential information, intellectual property, and trade secrets.', lastUpdated: 'May 15, 2026' },
  { id: 'tpl-3', name: 'Employment Contract', description: 'Full-time employment contract template including role, responsibilities, compensation, and benefits.', lastUpdated: 'Apr 20, 2026' },
  { id: 'tpl-4', name: 'Exit Clearance Form', description: 'Offboarding clearance checklist covering asset return, access revocation, and final settlement.', lastUpdated: 'Mar 10, 2026' },
  { id: 'tpl-5', name: 'Policy Template', description: 'Company policy template for creating new internal policies with approval workflows.', lastUpdated: 'Feb 28, 2026' },
];

// --- Category badge colors ---

const categoryColorMap: Record<string, string> = {
  'offer-letter': 'bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
  contract: 'bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
  'id-proof': 'bg-orange-50 text-orange-700 dark:bg-orange-950/50 dark:text-orange-400',
  'tax-form': 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  'policy-acknowledgment': 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400',
  certificate: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
};

const statusColorMap: Record<string, string> = {
  verified: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400',
  expired: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400',
};

// --- Column definitions ---

const documentColumns: ColumnDef<DocumentItem>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Document Name" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <FileText className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <span className="max-w-[200px] truncate font-medium text-sm">{row.getValue('name')}</span>
      </div>
    ),
  },
  {
    accessorKey: 'category',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => {
      const category = row.getValue('category') as string;
      return <StatusBadge status={category} variantMap={categoryColorMap} />;
    },
    filterFn: (row, id, value) => value === row.getValue(id),
  },
  {
    accessorKey: 'employee',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Employee" />,
  },
  {
    accessorKey: 'uploadDate',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Upload Date" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.getValue('uploadDate')}</span>,
  },
  {
    accessorKey: 'fileSize',
    header: ({ column }) => <DataTableColumnHeader column={column} title="File Size" />,
    cell: ({ row }) => <span className="text-muted-foreground">{row.getValue('fileSize')}</span>,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.getValue('status') as string;
      return <StatusBadge status={status} variantMap={statusColorMap} />;
    },
  },
  {
    id: 'actions',
    header: 'Actions',
    cell: () => (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon-xs">
          <Eye className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon-xs">
          <Download className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon-xs" className="text-red-500 hover:text-red-600">
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    ),
  },
];

// --- Skeleton ---

function DocumentsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Skeleton className="h-8 w-36" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-8 w-36" />
      </div>
      <Skeleton className="h-8 w-72" />
      <Skeleton className="h-[400px] rounded-lg" />
    </div>
  );
}

// --- Page ---

export default function DocumentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Upload Document dialog state
  const [uploadOpen, setUploadOpen] = useState(false);
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState('');
  const [docEmployee, setDocEmployee] = useState('');
  const [docDescription, setDocDescription] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleUploadDocument = async () => {
    if (!docName || !docCategory || !docEmployee) return;
    setUploadLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    toast.success(`Document "${docName}" uploaded successfully`);
    setUploadLoading(false);
    setUploadOpen(false);
    setDocName('');
    setDocCategory('');
    setDocEmployee('');
    setDocDescription('');
  };

  const filteredDocuments = useMemo(() => {
    if (categoryFilter === 'all') return documents;
    return documents.filter((d) => d.category === categoryFilter);
  }, [categoryFilter]);

  if (isLoading) {
    return <DocumentsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Documents"
        description="Manage employee documents, templates, and categories."
      >
        <Button className="gap-1.5" onClick={() => setUploadOpen(true)}>
          <Upload className="size-4" aria-hidden="true" />
          Upload Document
        </Button>
      </PageHeader>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        {/* All Documents Tab */}
        <TabsContent value="all" className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Select
              value={categoryFilter}
              onValueChange={(v) => v && setCategoryFilter(v)}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="Offer Letter">Offer Letter</SelectItem>
                <SelectItem value="Contract">Contract</SelectItem>
                <SelectItem value="ID Proof">ID Proof</SelectItem>
                <SelectItem value="Tax Form">Tax Form</SelectItem>
                <SelectItem value="Policy Acknowledgment">Policy Acknowledgment</SelectItem>
                <SelectItem value="Certificate">Certificate</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DataTable
            columns={documentColumns}
            data={filteredDocuments}
            searchKey="name"
            searchPlaceholder="Search documents..."
            showPagination
            pageSize={12}
          />
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories" className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <Card key={cat.id} className="transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <CatIcon className="size-5 text-muted-foreground" aria-hidden="true" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold">{cat.name}</h3>
                          <Badge variant="secondary">{cat.count} docs</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {cat.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        {/* Templates Tab */}
        <TabsContent value="templates" className="space-y-4">
          {templates.map((template) => (
            <Card key={template.id} className="transition-shadow hover:shadow-md">
              <CardContent className="p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                      <FileText className="size-5 text-muted-foreground" aria-hidden="true" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">{template.name}</h4>
                      <p className="text-xs text-muted-foreground leading-relaxed max-w-lg">
                        {template.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Last updated: {template.lastUpdated}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="shrink-0 gap-1.5">
                    <Download className="size-3.5" />
                    Download
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Upload Document Dialog */}
      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
            <DialogDescription>
              Upload a new document to the employee document vault.
            </DialogDescription>
          </DialogHeader>
          <DialogBody className="space-y-4">
            <FormFieldWrapper label="Document Name" required htmlFor="doc-name">
              <Input
                id="doc-name"
                placeholder="e.g. Alice_Johnson_Offer_Letter.pdf"
                value={docName}
                onChange={(e) => setDocName(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Category" required htmlFor="doc-category">
              <Select
                value={docCategory}
                onValueChange={(v) => v && setDocCategory(v)}
              >
                <SelectTrigger id="doc-category" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Offer Letter">Offer Letter</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="ID Proof">ID Proof</SelectItem>
                  <SelectItem value="Tax Form">Tax Form</SelectItem>
                  <SelectItem value="Policy">Policy</SelectItem>
                  <SelectItem value="Certificate">Certificate</SelectItem>
                </SelectContent>
              </Select>
            </FormFieldWrapper>

            <FormFieldWrapper label="Employee" required htmlFor="doc-employee">
              <Input
                id="doc-employee"
                placeholder="e.g. Alice Johnson"
                value={docEmployee}
                onChange={(e) => setDocEmployee(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="Description" htmlFor="doc-description">
              <Textarea
                id="doc-description"
                placeholder="Brief description of the document..."
                rows={2}
                value={docDescription}
                onChange={(e) => setDocDescription(e.target.value)}
              />
            </FormFieldWrapper>

            <FormFieldWrapper label="File">
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/30 px-6 py-8 text-center transition-colors hover:border-muted-foreground/50 hover:bg-muted/50 cursor-pointer">
                <Upload className="mx-auto size-8 text-muted-foreground/50" aria-hidden="true" />
                <p className="mt-2 text-sm font-medium">Click to upload or drag and drop</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  PDF, DOC, DOCX, PNG, JPG up to 10MB
                </p>
              </div>
            </FormFieldWrapper>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setUploadOpen(false)}
              disabled={uploadLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUploadDocument}
              disabled={uploadLoading || !docName.trim() || !docCategory || !docEmployee.trim()}
            >
              {uploadLoading && (
                <Loader2
                  className="mr-1.5 size-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Upload Document
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
