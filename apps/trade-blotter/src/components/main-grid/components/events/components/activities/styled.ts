import { styled } from '@sfcm/framework';

export const EventsBlockingMessage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--spinner-background, rgba(255, 255, 255, 0.8));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: var(--spinner-z-index, 9);
  pointer-events: auto;
  text-align: center;
`;

export const EventsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;
