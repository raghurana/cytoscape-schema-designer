import { Types } from '../RiverSchematic/RiverSchematic.interfaces';

export interface FeatureIconProps {
  featureType: Types.SpecialFeature;
  invert?: boolean;
  select?: boolean;
}

export function FeatureIcon({ featureType, invert = false, select = false }: FeatureIconProps): JSX.Element {
  switch (featureType) {
    case 'Rivergauge':
      return <RiverGaugeIcon invert={invert} select={select} />;
    case 'Storage':
      return <StorageIcon invert={invert} select={select} />;
    case 'Wetland':
      return <WetlandIcon invert={false} />;
  }
}

export function RiverGaugeIcon({
  invert = false,
  select = false,
}: Pick<FeatureIconProps, 'invert' | 'select'>): JSX.Element {
  const iconColor1 = select ? '#1E1E1E' : invert ? '#FFFFFF' : '#2461E5';
  const iconColor2 = select ? '#1E1E1E' : invert ? '#FFFFFF' : '#8FADEE';
  const backgroundColor = select ? 'transparent' : invert ? '#1E1E1E' : 'transparent';

  return (
    <svg
      width="18px"
      height="18px"
      viewBox="0 0 24 24"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      style={{ backgroundColor }}
    >
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <path
          d="M16.5 1v11c0 .091-.003.182-.01.272l.057-.063.166-.203L17.5 11l.787 1.006A5.985 5.985 0 0023 14.3v2a7.985 7.985 0 01-5.5-2.196 7.985 7.985 0 01-11 0l-.237.216A7.985 7.985 0 011 16.301v-2c1.84 0 3.578-.846 4.713-2.295L6.5 11l.787 1.006c.07.088.14.173.213.256V1h9zm-2 2h-5v2h3v2h-3v2h2v2h-2v2.755a5.983 5.983 0 005 0V3z"
          fill={iconColor1}
        />
        <path
          d="M12 22.301a7.985 7.985 0 005.5-2.196 7.985 7.985 0 005.5 2.196v-2a5.985 5.985 0 01-4.713-2.295L17.5 17l-.787 1.006a5.985 5.985 0 01-9.426 0L6.5 17l-.787 1.006A5.985 5.985 0 011 20.3v2c1.953 0 3.82-.714 5.263-1.98l.237-.216a7.985 7.985 0 005.5 2.196z"
          fill={iconColor2}
          fillRule="nonzero"
        />
      </g>
    </svg>
  );
}

export function StorageIcon({
  invert = false,
  select = false,
}: Pick<FeatureIconProps, 'invert' | 'select'>): JSX.Element {
  return (
    <svg width="16px" height="16px" viewBox="0 0 22 17" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g
          transform="translate(-1.000000, -4.000000)"
          fill={invert || select ? '#1E1E1E' : '#2461E5'}
          fillRule="nonzero"
        >
          <g>
            <path d="M21,4 L21,18 C21,18.553 20.553,19 20,19 L4,19 C3.447,19 3,18.553 3,18 L3,4 L1,4 L1,18 C1,19.654 2.346,21 4,21 L20,21 C21.654,21 23,19.654 23,18 L23,4"></path>
            <path d="M12,10.5 C10.501,10.5 9.071,9.933 8,8.937 C6.929,9.933 5.499,10.5 4,10.5 L4,8.502 C5.339,8.502 6.602,7.748 7.428,6.716 L8,6 L8.572,6.716 C9.398,7.748 10.661,8.502 12,8.502 C13.339,8.502 14.602,7.748 15.428,6.716 L16,6 L16.572,6.716 C17.398,7.748 18.661,8.502 20,8.502 L20,10.5 C18.501,10.5 17.071,9.933 16,8.937 C14.929,9.933 13.499,10.5 12,10.5"></path>
          </g>
        </g>
      </g>
    </svg>
  );
}

export function WetlandIcon({ invert = false }: Pick<FeatureIconProps, 'invert'>): JSX.Element {
  return (
    <svg
      width="16px"
      height="16px"
      data-name="Layer 1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill={invert ? '#1E1E1E' : '#164D39'}
    >
      <defs>
        <clipPath>
          <path d="M6.11,1.21c.66,0,1.19,.53,1.19,1.19v3.18c0,.66-.53,1.19-1.19,1.19s-1.19-.53-1.19-1.19V2.4c0-.66,.53-1.19,1.19-1.19Z" />
        </clipPath>
        <clipPath>
          <path d="M12.5,1.23c.59,.45,.71,1.29,.26,1.88l-1.74,2.3c-.45,.59-1.29,.71-1.88,.26s-.71-1.29-.26-1.88l1.74-2.3c.45-.59,1.29-.71,1.88-.26Z" />
        </clipPath>
      </defs>
      <g>
        <path d="M6.11,1.21c.66,0,1.19,.53,1.19,1.19v3.18c0,.66-.53,1.19-1.19,1.19s-1.19-.53-1.19-1.19V2.4c0-.66,.53-1.19,1.19-1.19Z" />
        <g>
          <path d="M6.11,1.21c.66,0,1.19,.53,1.19,1.19v3.18c0,.66-.53,1.19-1.19,1.19s-1.19-.53-1.19-1.19V2.4c0-.66,.53-1.19,1.19-1.19Z" />
        </g>
      </g>
      <g>
        <path d="M12.5,1.23c.59,.45,.71,1.29,.26,1.88l-1.74,2.3c-.45,.59-1.29,.71-1.88,.26s-.71-1.29-.26-1.88l1.74-2.3c.45-.59,1.29-.71,1.88-.26Z" />
        <g>
          <path d="M12.5,1.23c.59,.45,.71,1.29,.26,1.88l-1.74,2.3c-.45,.59-1.29,.71-1.88,.26s-.71-1.29-.26-1.88l1.74-2.3c.45-.59,1.29-.71,1.88-.26Z" />
        </g>
      </g>
      <path d="M8,16c1.44,0,2.8-.55,3.83-1.53,1.03,.97,2.39,1.53,3.83,1.53v-1.39c-1.28,0-2.49-.59-3.28-1.6l-.55-.7-.55,.7c-.79,1.01-2,1.6-3.28,1.6s-2.49-.59-3.28-1.6l-.55-.7-.55,.7c-.79,1.01-2,1.6-3.28,1.6v1.39c1.36,0,2.66-.5,3.66-1.38l.16-.15c1.03,.97,2.39,1.53,3.83,1.53h.01Z" />
      <path d="M12.92,0l.81,1.13c-2.69,1.93-4.42,4.94-5.19,9.05,1.23-2.1,2.8-3.48,4.71-4.14l.45,1.32c-1.52,.52-2.81,1.64-3.87,3.37,1.44-1.42,3.26-2.15,5.46-2.15v1.39c-2.63,0-4.57,1.2-5.9,3.69-.45,.16-.92,.25-1.41,.25-.77,0-1.52-.22-2.17-.61-.86-1.57-1.85-2.45-2.95-2.67l.27-1.37c1.18,.24,2.21,.95,3.1,2.12-.89-3.27-1.08-7-.57-11.19l1.38,.17c-.42,3.4-.35,6.46,.18,9.19,.9-4.26,2.78-7.45,5.7-9.55Z" />
    </svg>
  );
}

export function MainRiverIcon() {
  return (
    <svg width="22px" height="8px" viewBox="0 0 22 8" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-563.000000, -459.000000)" fill="#2461E5" fillRule="nonzero">
          <g transform="translate(546.000000, 376.000000)">
            <g transform="translate(17.000000, 76.000000)">
              <path d="M17.875,7 C20.1531746,7 22,8.790861 22,11 C22,13.209139 20.1531746,15 17.875,15 L4.125,15 C1.84682541,15 0,13.209139 0,11 C0,8.790861 1.84682541,7 4.125,7 L17.875,7 Z"></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

export function TributaryIcon() {
  return (
    <svg width="22px" height="4px" viewBox="0 0 22 4" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-563.000000, -487.000000)" fill="#2461E5" fillRule="nonzero">
          <g transform="translate(546.000000, 376.000000)">
            <g transform="translate(17.000000, 102.000000)">
              <path d="M19.6842105,9 C20.9631857,9 22,9.8954305 22,11 C22,12.1045695 20.9631857,13 19.6842105,13 L2.31578947,13 C1.03681426,13 0,12.1045695 0,11 C0,9.8954305 1.03681426,9 2.31578947,9 L19.6842105,9 Z"></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

export function EphemeralStreamIcon() {
  return (
    <svg width="23px" height="5px" viewBox="0 0 23 5" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-562.000000, -516.000000)" fill="#2461E5" fillRule="nonzero">
          <g transform="translate(546.000000, 376.000000)">
            <g transform="translate(16.500000, 132.000000)">
              <path d="M3.14285714,8 C4.30002519,8 5.23809524,8.93807005 5.23809524,10.0952381 C5.23809524,11.2524061 4.30002519,12.1904762 3.14285714,12.1904762 L2.0952381,12.1904762 C0.938070048,12.1904762 0,11.2524061 0,10.0952381 C0,8.93807005 0.938070048,8 2.0952381,8 L3.14285714,8 Z M11.5238095,8 C12.6809776,8 13.6190476,8.93807005 13.6190476,10.0952381 C13.6190476,11.2524061 12.6809776,12.1904762 11.5238095,12.1904762 L10.4761905,12.1904762 C9.31902243,12.1904762 8.38095238,11.2524061 8.38095238,10.0952381 C8.38095238,8.93807005 9.31902243,8 10.4761905,8 L11.5238095,8 Z M19.9047619,8 C21.06193,8 22,8.93807005 22,10.0952381 C22,11.2524061 21.06193,12.1904762 19.9047619,12.1904762 L18.8571429,12.1904762 C17.6999748,12.1904762 16.7619048,11.2524061 16.7619048,10.0952381 C16.7619048,8.93807005 17.6999748,8 18.8571429,8 L19.9047619,8 Z"></path>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}

export function FlowDirectionIcon() {
  return (
    <svg width="22px" height="7px" viewBox="0 0 22 7" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <g stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
        <g transform="translate(-562.000000, -545.000000)" fill="#2461E5">
          <g transform="translate(546.000000, 376.000000)">
            <g transform="translate(16.000000, 162.000000)">
              <g transform="translate(0.000000, 7.000000)">
                <polygon
                  transform="translate(18.806452, 3.500000) rotate(-90.000000) translate(-18.806452, -3.500000) "
                  points="18.8064516 0.306451613 22.3064516 6.69354839 15.3064516 6.69354839"
                ></polygon>
                <polygon
                  transform="translate(11.000000, 3.500000) rotate(-90.000000) translate(-11.000000, -3.500000) "
                  points="11 0.306451613 14.5 6.69354839 7.5 6.69354839"
                ></polygon>
                <polygon
                  transform="translate(3.193548, 3.500000) rotate(-90.000000) translate(-3.193548, -3.500000) "
                  points="3.19354839 0.306451613 6.69354839 6.69354839 -0.306451613 6.69354839"
                ></polygon>
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
