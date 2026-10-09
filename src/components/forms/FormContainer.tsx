import { OptiFormsContainerContentType } from '@optimizely/cms-sdk';
import { getPreviewUtils, OptimizelyGridSection } from '@optimizely/cms-sdk/react/server';
import {
  FormStep,
  FormSubmissionProvider,
  getFormButtonRole,
  isFormButtonNode,
  partitionFormNodes,
} from '@optimizely/cms-sdk/forms/react';
import FormContainerClient from './FormContainerClient';
import FormAlerts from './FormAlerts';
import FormStepNavigation from './FormStepNavigation';
import FormStepTracker from './FormStepTracker';
import { GridColumn, GridRow } from './Grid';

type Props = { content: OptiFormsContainerContentType };
type Node = NonNullable<OptiFormsContainerContentType['nodes']>[number];

const roleOf = (node: Node) =>
  getFormButtonRole((node as { component?: { Label?: string | null } }).component ?? {});

/**
 * Renderer for the CMS "Form Container" block.
 * Structure in the CMS: Form Container → Form Step(s) → Row → Column → elements.
 */
export default function FormContainer({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const nodes = (content.nodes ?? []) as Node[];
  const stepNodes = nodes.filter((node) => !isFormButtonNode(node));
  const looseButtons = nodes.filter(isFormButtonNode);

  return (
    <FormSubmissionProvider>
      <div id={`form-${content._metadata?.key ?? 'x'}`} className="form">
        {content.Title && (
          <h2 className="form-title" {...pa('Title')}>
            {content.Title}
          </h2>
        )}
        {content.Description && (
          <p className="form-description" {...pa('Description')}>
            {content.Description}
          </p>
        )}

        <FormAlerts submitConfirmationMessage={content.SubmitConfirmationMessage ?? null} />

        <FormContainerClient
          formKey={content._metadata?.key ?? undefined}
          scrollToOnSuccess={`form-${content._metadata?.key ?? 'x'}`}
          scrollToOnError={false}
          action={content.SubmitUrl?.default ?? ''}
          steps={stepNodes}
          rules={content.DependencyRules}
        >
          <div className="form-card">
            <FormStepTracker steps={stepNodes.length} />

            {stepNodes.map((node, index) => {
              // Lift buttons out of the editor's rows so they render as one footer
              const step = partitionFormNodes([node]) as { content: Node[]; buttons: Node[] };
              return (
                <FormStep key={node.key} index={index} node={node as { key: string }}>
                  <OptimizelyGridSection nodes={step.content} row={GridRow} column={GridColumn} />
                  <FormStepNavigation
                    totalSteps={stepNodes.length}
                    hasOwnButtons={step.buttons.map(roleOf)}
                  />
                  {step.buttons.length > 0 && (
                    <div className="form-actions">
                      <OptimizelyGridSection nodes={step.buttons} row={GridRow} column={GridColumn} />
                    </div>
                  )}
                </FormStep>
              );
            })}

            {looseButtons.length > 0 && (
              <div className="form-actions">
                <OptimizelyGridSection nodes={looseButtons} row={GridRow} column={GridColumn} />
              </div>
            )}
          </div>
        </FormContainerClient>
      </div>
    </FormSubmissionProvider>
  );
}
