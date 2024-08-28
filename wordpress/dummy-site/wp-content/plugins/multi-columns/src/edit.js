/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, RichText, InspectorControls, PanelColorSettings, InnerBlocks } from '@wordpress/block-editor';

import { RangeControl, PanelBody, SelectControl } from '@wordpress/components';

import NumberControl from './components/number-control';
/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function save({ attributes, setAttributes }) {
	const {
		columnCount,
		columnWidth,
		columnGap,
		columnRuleStyle,
		columnRuleWidth,
		columnRuleColor,
		dropCapColor,
		dropCapSize
	} = attributes;
	const columnStyles = {
		columnCount,
		columnWidth,
		columnGap,
		columnRuleStyle,
		columnRuleWidth,
		columnRuleColor,
		'--drop-cap-color': dropCapColor,
		'--drop-cap-font-size': dropCapSize.fontSize,
		'--drop-cap-line-height': dropCapSize.lineHeight,
	};

	const ALLOWED_BLOCKS = ['core/heading', 'core/paragraph', 'core/image'];
	const TEMPLATE_PARAGRAPHS = [
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin finibus, lectus non interdum cursus, arcu sapien mollis lacus, et tincidunt odio nisi ut purus. Duis eleifend, magna placerat faucibus tincidunt, orci nulla ornare tortor, eget egestas tortor nunc quis sem. Cras in tortor justo. Nulla consectetur leo vel blandit consectetur. Fusce quis sapien ante. Vestibulum non varius augue, et ultricies urna. Integer hendrerit suscipit nibh.',
		'Interdum et malesuada fames ac ante ipsum primis in faucibus. Cras vestibulum mauris diam. Praesent semper diam a efficitur iaculis. Nullam lacinia augue quis lorem accumsan tempus. Maecenas dapibus velit eu blandit pretium. Nullam posuere ut ipsum in commodo. Fusce fringilla quis turpis a placerat. Etiam hendrerit velit a lacus varius ornare.',
	];
	const MC_TEMPLATE = [
		['core/heading', { level: 2, placeholder: 'Heading...' }],
		['core/paragraph', { placeholder: TEMPLATE_PARAGRAPHS[0] }],
		['core/heading', { level: 4, placeholder: 'Sub-heading...' }],
		['core/paragraph', { placeholder: TEMPLATE_PARAGRAPHS[1] }],
	];

	const onChangeColumnRuleStyle = (val) => {
		setAttributes({ columnRuleStyle: val });
	};

	const onChangeColumnGap = (val) => {
		setAttributes({ columnGap: Number(val) });
	};

	const onChangeColumnWidth = (val) => {
		setAttributes({ columnWidth: Number(val) });
	};

	const onChangeColumnCount = (val) => {
		setAttributes({ columnCount: val });
	};

	const onChangeColumnRuleWidth = (val) => {
		setAttributes({ columnRuleWidth: Number(val) });
	};

	const onChangeColumnRuleColor = (val) => {
		setAttributes({ columnRuleColor: val });
	};

	const onChangeDropCapColor = (val) => {
		setAttributes({ dropCapColor: val });
	};

	const onChangeDropCapSize = (val) => {
		switch (val) {
			case 'small':
				setAttributes({
					dropCapSize: {
						size: 'small',
						fontSize: '3.8rem',
						lineHeight: '3.5rem',
					},
				});
				break;
			case 'large':
				setAttributes({
					dropCapSize: {
						size: 'large',
						fontSize: '6.2rem',
						lineHeight: '5.2rem',
					},
				});
				break;
			default:
				setAttributes({
					dropCapSize: {
						size: 'small',
						fontSize: '3.8rem',
						lineHeight: '3.5rem',
					},
				});
		}
	};

	const colorSettingsDropDown =
	attributes.className === 'is-style-drop-cap'
		? [
			{
				value: columnRuleColor,
				onChange: onChangeColumnRuleColor,
				label: __('Separator colour', 'multi-columns'),
			},
			{
				value: dropCapColor,
				onChange: onChangeDropCapColor,
				label: __('Drop Capital colour', 'multi-columns'),
			},
		]
		: [
			{
				value: columnRuleColor,
				onChange: onChangeColumnRuleColor,
				label: __('Separator colour', 'multi-columns'),
			},
		];

	return (
		<>
			<InspectorControls>
				<PanelBody title='Column Settings'>
					<RangeControl
						label="Columns"
						value={columnCount}
						onChange={onChangeColumnCount}
						min={2}
						max={6}
					/>

					<NumberControl
						label="Width"
						value={columnWidth}
						onChange={onChangeColumnWidth}
						min={120}
						max={500}
						step={10}
					/>

					<NumberControl
						label="Gap"
						onChange={onChangeColumnGap}
						value={columnGap}
						min={10}
						max={100}
					/>
				</PanelBody>

				<PanelBody title="Column Separator">
					<SelectControl
						label="Separator Style"
						onChange={onChangeColumnRuleStyle}
						value={columnRuleStyle}
						options={[
							{
								label: 'None',
								value: 'none',
							},
							{
								label: 'Solid',
								value: 'solid',
							},
							{
								label: 'Dotted',
								value: 'dotted',
							},
							{
								label: 'Dashed',
								value: 'dashed',
							},
							{
								label: 'Double',
								value: 'double',
							},
							{
								label: 'Groove',
								value: 'groove',
							},
							{
								label: 'Ridge',
								value: 'ridge',
							},
						]}
					/>

					<NumberControl
						label="Width"
						onChange={onChangeColumnRuleWidth}
						value={columnRuleWidth}
						min={1}
						max={8}
					/>
				</PanelBody>

				{attributes.className === 'is-style-drop-cap' ? (
					<PanelBody
						title={__('Drop-Cap', 'multi-columns')}
						initialOpen={false}
					>
						<SelectControl
							label={__('Size', 'multi-columns')}
							onChange={onChangeDropCapSize}
							value={dropCapSize.size}
							options={[
								{
									label: __('Small', 'multi-columns'),
									value: 'small',
								},
								{
									label: __('Large', 'multi-columns'),
									value: 'large',
								},
							]}
						/>
					</PanelBody>
				) : null}

				<PanelColorSettings
					title={__('Colour settings', 'multi-columns')}
					initialOpen={false}
					colorSettings={colorSettingsDropDown}
				></PanelColorSettings>
			</InspectorControls>

			<div {...useBlockProps({ style: columnStyles })}>
				<InnerBlocks allowedBlocks={ALLOWED_BLOCKS} template={MC_TEMPLATE} />
			</div>
		</>
	);
}
