export type ModalType = {
  placeForm: boolean;
  setPlaceForm: React.Dispatch<React.SetStateAction<boolean>>;
} | null

export type ModalContextType = {
  modal: ModalType;
}

export const defaultModalContext: ModalContextType = {
  modal: null
}