import React, { useState, useEffect } from "react";
import "../App.css";

function Form() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        gender: "",
        address: "",
        city: "",
    });

    const [submittedData, setSubmittedData] = useState([]);
    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const [editIndex, setEditIndex] = useState(null);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Load data from sessionStorage on mount
    useEffect(() => {
        const storedData = JSON.parse(sessionStorage.getItem("submittedData"));
        if (storedData) {
            setSubmittedData(storedData);
        }
    }, []);

    // Store data in sessionStorage whenever submittedData changes
    useEffect(() => {
        sessionStorage.setItem("submittedData", JSON.stringify(submittedData));
    }, [submittedData]);

    const validateForm = () => {
        let formErrors = {};
        if (!formData.name) formErrors.name = "Name is required";
        if (!formData.email) {
            formErrors.email = "Email is required";
        } else if (!emailRegex.test(formData.email)) {
            formErrors.email = "Please enter a valid email address";
        }
        if (!formData.password) formErrors.password = "Password is required";
        if (!formData.gender) formErrors.gender = "Gender is required";
        if (!formData.address) formErrors.address = "Address is required";
        if (!formData.city) formErrors.city = "City is required";

        return formErrors;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length === 0) {
            if (isEditing) {
                // Update the existing row
                const updatedData = submittedData.map((item, index) =>
                    index === editIndex ? formData : item
                );
                setSubmittedData(updatedData);
                setIsEditing(false);
                setEditIndex(null);
            } else {
                // Add new row
                setSubmittedData([...submittedData, formData]);
            }
            setFormData({
                name: "",
                email: "",
                password: "",
                gender: "",
                address: "",
                city: "",
            });
            setErrors({});
        } else {
            setErrors(validationErrors);
        }
    };

    const handleEdit = (index) => {
        setFormData(submittedData[index]);
        setIsEditing(true);
        setEditIndex(index);
    };

    const handleDelete = (index) => {
        const updatedData = submittedData.filter((_, i) => i !== index);
        setSubmittedData(updatedData);
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name: </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    {errors.name && <p className="error">{errors.name}</p>}
                </div>

                <div>
                    <label>Email: </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p className="error">{errors.email}</p>}
                </div>

                <div>
                    <label>Password: </label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    {errors.password && <p className="error">{errors.password}</p>}
                </div>

                <div>
                    <label>Gender: </label>
                    <input
                        type="radio"
                        name="gender"
                        value="Male"
                        checked={formData.gender === "Male"}
                        onChange={handleChange}
                    />{" "}
                    Male
                    <input
                        type="radio"
                        name="gender"
                        value="Female"
                        checked={formData.gender === "Female"}
                        onChange={handleChange}
                    />{" "}
                    Female
                    {errors.gender && <p className="error">{errors.gender}</p>}
                </div>

                <div>
                    <label>Address: </label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                    />
                    {errors.address && <p className="error">{errors.address}</p>}
                </div>

                <div>
                    <label>City: </label>
                    <select name="city" value={formData.city} onChange={handleChange}>
                        <option value="">Select City</option>
                        <option value="New York">New York</option>
                        <option value="Los Angeles">Los Angeles</option>
                        <option value="Chicago">Chicago</option>
                    </select>
                    {errors.city && <p className="error">{errors.city}</p>}
                </div>

                <button type="submit">{isEditing ? "Update" : "Submit"}</button>
            </form>

            <h2>Submitted Data</h2>
            {submittedData.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Gender</th>
                            <th>Address</th>
                            <th>City</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submittedData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.name}</td>
                                <td>{data.email}</td>
                                <td>{data.gender}</td>
                                <td>{data.address}</td>
                                <td>{data.city}</td>
                                <td>
                                    <button onClick={() => handleEdit(index)}>Edit</button>
                                    <button onClick={() => handleDelete(index)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default Form;
