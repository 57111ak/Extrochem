function PropertyInput({ label, keyName, range, settings, handleChange }) {
  return (
    <div className="mb-4">
      {/* Label and Number Inputs */}
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex gap-4">
          <input
            type="number"
            value={settings[keyName][0]}
            min={range[0]}
            max={range[1]}
            onChange={(e) => handleChange(e, keyName, 0)}
            className="px-4 py-2 bg-[#0A2039] border border-zinc-500 font-light rounded"
          />
          <input
            type="number"
            value={settings[keyName][1]}
            min={range[0]}
            max={range[1]}
            onChange={(e) => handleChange(e, keyName, 1)}
            className="px-4 py-2 bg-[#0b0a31] border border-zinc-500 rounded"
          />
        </div>
      </div>

      {/* Slider */}
      <div className="flex mt-2">
        <input
          type="range"
          min={range[0]}
          max={range[1]}
          value={settings[keyName][1]}
          onChange={(e) => handleChange(e, keyName, 1)}
          className="flex-1"
        />
      </div>
    </div>
  );
}

export default PropertyInput;