import React, { useState } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import Calendar from "./pages/Calendar";
import DeleteLesson from "./containers/deleteLesson";
import DetailsLesson from "./containers/detailsLesson";
import Modal from "./containers/Modal.jsx";
import SignIn from "./pages/SignIn";
import ApproveLink from "./pages/ApprovalLink";
import "./App.css";
import { useSelector } from "react-redux";
import MenuList from "./components/MenuList";
import { MenuProvider } from "./context/useMenu";
import styled from "styled-components";
import DateSliderDays from "./containers/DateSliderDays";
import DateSliderWeeks from "./components/DateSliderWeeks";
import Private2 from "./pages/Private2";
import Header from "./components/Header";
import FormWrapper from "./components/formWrapper.jsx";

function App() {
  const theme = useSelector((state) => state.theme);

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <MenuProvider>
          <AppContent />
        </MenuProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

function AppContent() {
  const [isMenuOpen, toggleMenu] = useState(false);

  const handleToggleMenu = () => {
    toggleMenu(!isMenuOpen);
  };

  const isDeleteLessonModalOpen = useSelector(
    (state) => state.calendar.isDeleteLessonModalOpen
  );

  const isDetailsLessonModalOpen = useSelector(
    (state) => state.calendar.isDetailsLessonModalOpen
  );

  return (
    <VerticalContainer>
      <Header />
      <MenuList isMenuOpen={isMenuOpen} handleToggleMenu={handleToggleMenu} />

      {isDeleteLessonModalOpen && (
        <Modal type="delete">
          <DeleteLesson />
        </Modal>
      )}

      {isDetailsLessonModalOpen && (
        <Modal type="details">
          <DetailsLesson />
        </Modal>
      )}

      <Routes>
        {/* Default route should now redirect to calendar */}
        <Route path="/" element={<Navigate to="/calendar" replace />} />
        <Route
          path="/calendar"
          element={
            <StyledDisabledWrapper
              isDisabled={isDeleteLessonModalOpen || isDetailsLessonModalOpen}
            >
              <Calendar />
            </StyledDisabledWrapper>
          }
        />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/approveLink/:lessonId" element={<ApproveLink />} />
        <Route
          path="/requestPrivte"
          element={
            <FormWrapper>
              <Private2 />
            </FormWrapper>
          }
        />
        <Route path="/datesliderdays" element={<DateSliderDays />} />
        <Route path="/datesliderweeks" element={<DateSliderWeeks />} />

        {/* Only redirect to /calendar if no other route matches */}
        <Route path="*" element={<Navigate to="/calendar" replace />} />
      </Routes>
    </VerticalContainer>
  );
}

export const DisabledWrapper = ({ isDisabled, children, ...props }) => (
  <div {...props}>{children}</div>
);

export const StyledDisabledWrapper = styled(DisabledWrapper)`
  ${({ isDisabled }) =>
    isDisabled &&
    `
    opacity: 0.5;
    pointer-events: none;
    width: 100vw;
  `}
`;

const VerticalContainer = styled.div`
  flex: 1;
  display: flex;
  max-width: 100vw;
  flex-direction: column;
  min-height: 100svh;
  overflow: hidden;
`;

export default App;
