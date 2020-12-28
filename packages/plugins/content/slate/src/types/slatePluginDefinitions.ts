/* eslint-disable @typescript-eslint/ban-types */
import { ReactEditor } from 'slate-react';

import { Translations } from './translations';
import { Node } from 'slate';
import { JsonSchema } from '@react-page/editor';

export interface PluginButtonProps {
  translations?: Partial<Translations>;
}

export type SlatePluginControls<T extends {}> = {
  open: boolean;
  close: () => void;
  isActive: boolean;

  cancelLabel?: string;
  submitLabel?: string;
  removeLabel?: string;
  schema?: JsonSchema<T>;
  data: T;
  add: (p: { data?: T; text?: string }) => void;

  remove: () => void;
  shouldInsertWithText: boolean;
  getInitialData?: () => T;
} & PluginButtonProps;

export type SlateBasePluginDefinition<T extends {}> = {
  /** define a hotkey to toggle this plugin **/
  hotKey?: string;

  /**
   * the schema defines the controls of the plugin
   */
  schema?: JsonSchema<T>;
  /**
   *
   */
  Controls?: React.ComponentType<SlatePluginControls<T>>;
  /**
   * icon of this plugin in the toolbar
   */
  icon?: JSX.Element;
  /**
   * label / title of this plugin
   */
  label?: string;
  /**
   * whether to show this plugin the hover toolbar
   */
  addHoverButton: boolean;
  /**
   * whether to show this plugin in the bottom toolbar
   */
  addToolbarButton: boolean;
  /**
   * defines the initial data when an element is added
   */
  getInitialData?: () => T;

  isDisabled?: (editor: ReactEditor) => boolean;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onKeyDown?: (e: React.KeyboardEvent, editor: ReactEditor, next: any) => void;

  customAdd?: (editor: ReactEditor) => void;
  customRemove?: (editor: ReactEditor) => void;
};

export type SlateNodeBasePluginDefinition<T extends {}> = {
  object: SlateNodeObjectType;
} & SlateBasePluginDefinition<T>;
export type SlateNodeObjectType = 'inline' | 'block' | 'mark';

export type SlateDataPluginDefinition<
  T extends {}
> = SlateNodeBasePluginDefinition<T> & {
  dataMatches: (data: T) => boolean;
  /**
   * if defined these properties will be removed from data when plugin gets disabled
   */
  properties?: Array<keyof T>;
};

export type SlateCustomPluginDefinition<
  T extends {}
> = SlateBasePluginDefinition<T> & {};

export type MapLike<T extends {}> = {
  get<K extends keyof T>(key: K): T[K];
};

type ObjectProps = {
  object: 'block';
  replaceWithDefaultOnRemove?: boolean;
};

type InlineProps = {
  object: 'inline';
  addExtraSpace?: boolean;
};

type MarkProps = {
  object: 'mark';
};
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type NoInfer<T> = [T][T extends any ? 0 : never];

export type SlateComponentPluginDefinition<
  T extends {}
> = SlateNodeBasePluginDefinition<T> & {
  /**
   * a unique type (id) for the this component
   */
  type: string;
  /**
   * pass a function that receives the data and returns the style that is passed to the Component
   */
  getStyle?: (data: T) => React.CSSProperties;
  /**
   * defines how this element can be created by pasted html
   */
  deserialize?: {
    /**
     * html tag name
     */
    tagName: string;
    /**
     * pass a function that receives the html element and returns data found in that element
     */
    getData?: (el: HTMLElement) => T;
  };
  /**
   * the Component that renders this element. Can be a primitiv component like "div", "p", etc.
   * or a complex Component. If its a complex component, you should render the children passed in it
   *
   */
  Component:
    | keyof JSX.IntrinsicElements
    | React.ComponentType<
        NoInfer<
          {
            /**
             * the attributes should be passed directly to the rendered html element
             */
            attributes?: object;
            /**
             * the style that can be passed directly to the rendered html element
             */
            style?: React.CSSProperties;
            /**
             * className to pass to the renderd html element
             */
            className?: string;
            /**
             * raw child nodes. Usefull in certain niche cases
             */
            childNodes: Node[];

            /**
             * hook that returns true if the current element is focused
             */
            useFocused: () => boolean;
            /**
             * hook that returns true if the current element is selected
             */
            useSelected: () => boolean;

            /**
             * @returns the current text content as an array. Usefull in some advanced use cases
             */
            getTextContents: () => string[];
          } & T
        >
      >;
} & (ObjectProps | InlineProps | MarkProps);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SlatePluginDefinition<T extends { [key: string]: any }> =
  | (SlateComponentPluginDefinition<T> & { pluginType: 'component' })
  | (SlateDataPluginDefinition<T> & { pluginType: 'data' })
  | (SlateCustomPluginDefinition<T> & { pluginType: 'custom' });
