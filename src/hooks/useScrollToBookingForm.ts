import { useNavigate } from "react-router-dom"

export function useScrollToBookingForm() {
  const navigate = useNavigate()

  const goToBookingForm = (sessionId: number) => {
    navigate("/booking", {
      state: {
        scrollToForm: true,
        sessionId,
      },
    })
  }

  return goToBookingForm
}
