const ProgressSteps = ({ step1, step2, step3 }) => {
  return (
    <div className="progress-steps">
      <div className={`step ${step1 ? "completed-step" : "incomplete-step"}`}>
        <span>Login</span>
        <div className="step-icon">{step1 && "✅"}</div>
      </div>

      {step2 && (
        <>
          {step1 && <div className="step-connector completed-connector"></div>}
          <div className={`step ${step1 ? "completed-step" : "incomplete-step"}`}>
            <span>Shipping</span>
            <div className="step-icon">{step1 && "✅"}</div>
          </div>
        </>
      )}

      <>
        {step1 && step2 && step3 && (
          <div className="step-connector completed-connector"></div>
        )}

        <div className={`step ${step3 ? "completed-step" : "incomplete-step"}`}>
          <span className={!step3 ? "future-step" : ""}>Summary</span>
          {step1 && step2 && step3 && (
            <div className="step-icon">✅</div>
          )}
        </div>
      </>
    </div>
  );
};

export default ProgressSteps;