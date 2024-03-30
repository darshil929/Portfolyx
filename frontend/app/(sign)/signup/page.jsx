'use client'
import { useState } from 'react';
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation';


const SignUp = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: ''
      });

      const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
          ...prevData,
          [name]: value
        }));
      };


  const handleSubmit = async (event) => {
    event.preventDefault();
    // Handle form submission logic here

    const response = await fetch('http://localhost:8000/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },    
      body: JSON.stringify({
        name:formData.name,
        phone:formData.phone,
        email:formData.email,
        password:formData.password 
      }),
    })
    
    if(response.status != 200){
        let message = await response.json()
        alert(message.message)
        console.log("Error")
    }
    else{
        router.push('/login')
    }
    
  }

  return (
    <Card className="mx-auto max-w-sm mt-16">
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl font-bold">Signup</CardTitle>
      <CardDescription>Please fill in the following details to create an account</CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" placeholder="example@example.com" value={formData.email} onChange={handleChange} type="email" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" value={formData.password} onChange={handleChange} type="password" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" placeholder="1234567890" value={formData.phone} onChange={handleChange} type="tel" required />
          </div>
          <Button className="w-full" type="submit">
            Signup
          </Button>
        </div>
      </form>
    </CardContent>
  </Card>
  );
}

export default SignUp;


