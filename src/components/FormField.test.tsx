import { FormField } from "@/components/FormField";
import { fireEvent, render, screen } from "@testing-library/react-native";
import { StyleSheet } from "react-native";

describe("FormField", () => {
  it("renders the label and placeholder", () => {
    render(
      <FormField
        label="Client's Name"
        value=""
        onChangeText={jest.fn()}
        placeholder="Enter Client's Name"
      />,
    );
    expect(screen.getByText("Client's Name")).toBeTruthy();
    expect(screen.getByPlaceholderText("Enter Client's Name")).toBeTruthy();
  });

  it("calls onChangeText as the user types", () => {
    const onChangeText = jest.fn();
    render(<FormField label="Client's Name" value="" onChangeText={onChangeText} />);
    fireEvent.changeText(screen.getByDisplayValue(""), "Mr Peter Abu");
    expect(onChangeText).toHaveBeenCalledWith("Mr Peter Abu");
  });

  it("calls onBlur when the field loses focus", () => {
    const onBlur = jest.fn();
    render(
      <FormField label="Client's Name" value="" onChangeText={jest.fn()} onBlur={onBlur} />,
    );
    fireEvent(screen.getByDisplayValue(""), "blur");
    expect(onBlur).toHaveBeenCalled();
  });

  it("does not show an error message when there is no error", () => {
    render(<FormField label="Client's Name" value="" onChangeText={jest.fn()} />);
    expect(screen.queryByText(/required/i)).toBeNull();
  });

  it("shows the error message when one is given", () => {
    render(
      <FormField
        label="Client's Name"
        value=""
        onChangeText={jest.fn()}
        error="Client's name is required"
      />,
    );
    expect(screen.getByText("Client's name is required")).toBeTruthy();
  });

  it("gives the input an error border when invalid", () => {
    render(
      <FormField
        label="Client's Name"
        value=""
        onChangeText={jest.fn()}
        error="Client's name is required"
      />,
    );
    const input = screen.getByDisplayValue("");
    const flattened = StyleSheet.flatten(input.props.style);
    expect(flattened.borderColor).toBe("#DC2626");
  });

  it("renders as multiline when requested", () => {
    render(
      <FormField label="Terms" value="" onChangeText={jest.fn()} multiline />,
    );
    expect(screen.getByDisplayValue("").props.multiline).toBe(true);
  });
});
