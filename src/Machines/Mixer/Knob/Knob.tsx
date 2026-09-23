import {Flex} from '@radix-ui/themes';
import {KnobLabel} from './KnobLabel';
import {KnobControl} from './KnobControl';
import {KnobCut} from './KnobCut';
import {KnobIdle} from './KnobIdle';
import {KnobValue} from './KnobValue';

type KnobProps = {
    value: number;
    onValueChange: (e: number) => void;
    min: number;
    max: number;
    step: number;
    label?: string;
    showValue?: boolean;
    onCtrlClick?: () => void;
    mode?: 'gain' | 'pan';
} & (
    | {withCut?: false}
    | {
          withCut: true;
          isCut: boolean;
          onCutToggle: () => void;
      }
) &
    (
        | {withIdle?: false}
        | {
              withIdle: true;
              isIdle: boolean;
              onIdleToggle: () => void;
          }
    );

export const Knob: React.FC<KnobProps> = (props) => {
    const {value, onValueChange, min, max, step, label, withCut, withIdle, showValue, mode, onCtrlClick} = props;
    const showPostPart = withCut || withIdle || showValue;
    return (
        <>
            {label && <KnobLabel label={label} />}
            <KnobControl value={value} onChange={onValueChange} min={min} max={max} step={step} mode={mode} onCtrlClick={onCtrlClick} />
            {showPostPart && (
                <Flex justify={'center'} py={'1'}>
                    {withCut && <KnobCut isOn={props.isCut} onClick={props.onCutToggle} />}
                    {withIdle && <KnobIdle isOn={props.isIdle} onClick={props.onIdleToggle} />}
                    {showValue && <KnobValue value={value} />}
                </Flex>
            )}
        </>
    );
};
